/**
 * Real-Time Event & Telemetry Service
 * Connects to the backend Server-Sent Events (SSE) stream (/notifications/stream)
 * and coordinates instant bidirectional updates across Citizen, Government, and University portals.
 * Includes BroadcastChannel cross-tab synchronization and exponential backoff auto-reconnect.
 */

export interface RealtimeProblem {
  id: string;
  ticketId: string;
  ticket_id?: string;
  title: string;
  description: string;
  district: string;
  domain?: string;
  domainTags?: string[];
  severity?: string;
  priority?: string;
  status: string;
  attachments?: any;
  photos?: string[];
  createdAt?: string;
  created_at?: string;
}

export interface RealtimeStatusUpdate {
  id: string;
  ticketId: string;
  ticket_id?: string;
  status: string;
  note?: string;
  actor?: string;
  matchedTeam?: string;
  progressPercent?: number;
  updatedAt?: string;
}

export interface RealtimeUniversityAccepted {
  id: string;
  ticketId: string;
  ticket_id?: string;
  institutionName: string;
  teamName: string;
  studentName?: string;
  status: string;
  proposal?: string;
  updatedAt?: string;
}

export interface RealtimeUniversityAssigned {
  id: string;
  ticketId: string;
  ticket_id?: string;
  institutionId?: string;
  institutionName: string;
  status: string;
  instructions?: string;
  updatedAt?: string;
}

type Listener<T> = (data: T) => void;

class RealtimeService {
  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnecting: boolean = false;
  private reconnectTimeout: any = null;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 15000;

  // Listeners
  private problemSubmittedListeners: Set<Listener<RealtimeProblem>> = new Set();
  private statusUpdatedListeners: Set<Listener<RealtimeStatusUpdate>> = new Set();
  private universityAcceptedListeners: Set<Listener<RealtimeUniversityAccepted>> = new Set();
  private universityAssignedListeners: Set<Listener<RealtimeUniversityAssigned>> = new Set();
  private notificationListeners: Set<Listener<any>> = new Set();

  constructor() {
    this.initBroadcastChannel();
    this.connect();
  }

  private initBroadcastChannel() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.broadcastChannel = new BroadcastChannel("pookar_realtime_events");
        this.broadcastChannel.onmessage = (event) => {
          const { eventType, data } = event.data || {};
          if (eventType && data) {
            this.dispatchToListeners(eventType, data, false);
          }
        };
      } catch (err) {
        console.warn("[RealtimeService] BroadcastChannel init notice:", err);
      }
    }
  }

  public connect() {
    if (typeof window === "undefined" || this.isConnecting) return;
    if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) return;

    this.isConnecting = true;
    const token = localStorage.getItem("pookar_token") || localStorage.getItem("jansahyog_token") || "";
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/+$/, "");
    const streamUrl = `${apiBase}/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ""}`;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      const es = new EventSource(streamUrl);
      this.eventSource = es;

      es.onopen = () => {
        this.isConnecting = false;
        this.reconnectDelay = 1000; // Reset exponential backoff
      };

      // 1. Standard message event handler (catches fallback events and connected event)
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const type = data.eventType || data.type;
          if (type) {
            this.dispatchToListeners(type, data, true);
          }
        } catch {}
      };

      // 2. Named SSE event listeners
      es.addEventListener("problem_submitted", (event: any) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchToListeners("problem_submitted", data, true);
        } catch {}
      });

      es.addEventListener("problem_status_updated", (event: any) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchToListeners("problem_status_updated", data, true);
        } catch {}
      });

      es.addEventListener("university_accepted", (event: any) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchToListeners("university_accepted", data, true);
        } catch {}
      });

      es.addEventListener("university_assigned", (event: any) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchToListeners("university_assigned", data, true);
        } catch {}
      });

      es.addEventListener("notification", (event: any) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatchToListeners("notification", data, true);
        } catch {}
      });

      es.onerror = () => {
        this.isConnecting = false;
        es.close();
        this.eventSource = null;
        this.scheduleReconnect();
      };
    } catch {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnectDelay);
      this.connect();
    }, this.reconnectDelay);
  }

  private dispatchToListeners(eventType: string, data: any, broadcastLocally: boolean = false) {
    // Dispatch to registered listener sets
    switch (eventType.toLowerCase()) {
      case "problem_submitted":
      case "grievance_created":
        this.problemSubmittedListeners.forEach((fn) => fn(data));
        break;
      case "problem_status_updated":
      case "status_update":
        this.statusUpdatedListeners.forEach((fn) => fn(data));
        break;
      case "university_accepted":
      case "challenge_accepted":
        this.universityAcceptedListeners.forEach((fn) => fn(data));
        break;
      case "university_assigned":
      case "challenge_assigned":
        this.universityAssignedListeners.forEach((fn) => fn(data));
        break;
      case "notification":
        this.notificationListeners.forEach((fn) => fn(data));
        break;
      default:
        break;
    }

    // Forward across browser tabs
    if (broadcastLocally && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ eventType, data });
      } catch {}
    }
  }

  /**
   * Broadcast an event locally across tabs (e.g. immediately after submitting or updating status)
   */
  public emitLocalEvent(eventType: string, data: any) {
    this.dispatchToListeners(eventType, data, true);
  }

  // Listener subscriptions (return unsubscribe function)
  public onProblemSubmitted(cb: Listener<RealtimeProblem>): () => void {
    this.problemSubmittedListeners.add(cb);
    return () => this.problemSubmittedListeners.delete(cb);
  }

  public onStatusUpdated(cb: Listener<RealtimeStatusUpdate>): () => void {
    this.statusUpdatedListeners.add(cb);
    return () => this.statusUpdatedListeners.delete(cb);
  }

  public onUniversityAccepted(cb: Listener<RealtimeUniversityAccepted>): () => void {
    this.universityAcceptedListeners.add(cb);
    return () => this.universityAcceptedListeners.delete(cb);
  }

  public onUniversityAssigned(cb: Listener<RealtimeUniversityAssigned>): () => void {
    this.universityAssignedListeners.add(cb);
    return () => this.universityAssignedListeners.delete(cb);
  }

  public onNotification(cb: Listener<any>): () => void {
    this.notificationListeners.add(cb);
    return () => this.notificationListeners.delete(cb);
  }
}

export const realtimeService = new RealtimeService();
