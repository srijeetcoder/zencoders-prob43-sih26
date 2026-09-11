import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticationError, NotFoundError } from '../utils/errors';

interface SSEClient {
  id: string;
  userId?: string;
  role?: string;
  res: Response;
}

class NotificationManager {
  private static clients: Map<string, SSEClient> = new Map();

  static addClient(client: SSEClient): void {
    this.clients.set(client.id, client);
  }

  static removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  static broadcast(notification: {
    id: string;
    userId?: string;
    role?: string;
    title: string;
    message: string;
    type: string;
    link?: string;
    createdAt: string;
  }): void {
    const payload = `data: ${JSON.stringify(notification)}\n\n`;
    this.clients.forEach((client) => {
      // Send if broadcast or targeted to this user/role
      if (!notification.userId || notification.userId === client.userId) {
        try {
          client.res.write(payload);
        } catch {
          this.removeClient(client.id);
        }
      }
    });
  }
}

export class NotificationController {
  /**
   * Retrieves notifications for the authenticated user.
   */
  async getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || 'CITIZEN';

      let sql = `
        SELECT id, user_id, title, message, type, link, is_read, created_at
        FROM notifications
        WHERE user_id = $1 OR user_id IS NULL
        ORDER BY created_at DESC
        LIMIT 30;
      `;
      let params: any[] = [userId || '00000000-0000-0000-0000-000000000000'];

      const result = await query(sql, params);

      // If DB has no notifications yet, generate realistic initial state-specific notifications
      let items = result.rows;
      if (items.length === 0) {
        items = [
          {
            id: 'notif-sys-1',
            user_id: userId,
            title: 'National Innovation Ledger Active',
            message: 'PooKar 2.0 Societal Innovation Engine is synchronized with 24 Jharkhand District Desks.',
            type: 'broadcast',
            link: '/main',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'notif-sys-2',
            user_id: userId,
            title: 'Academic Partner Network Online',
            message: 'BIT Mesra and IIT (ISM) Dhanbad labs matched to live civic problem challenges.',
            type: 'match',
            link: '/partners',
            is_read: false,
            created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
          },
        ];
      }

      sendSuccess(res, {
        notifications: items,
        unreadCount: items.filter((n: any) => !n.is_read).length,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Server-Sent Events (SSE) endpoint for real-time live notification stream.
   */
  streamNotifications(req: Request, res: Response): void {
    const clientId = `sse-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId, timestamp: new Date().toISOString() })}\n\n`);

    const client: SSEClient = {
      id: clientId,
      userId: req.user?.id,
      role: req.user?.role,
      res,
    };

    NotificationManager.addClient(client);

    // Heartbeat ping every 25 seconds
    const interval = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 25000);

    req.on('close', () => {
      clearInterval(interval);
      NotificationManager.removeClient(clientId);
    });
  }

  /**
   * Marks a specific notification as read in database.
   */
  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await query(
        `UPDATE notifications SET is_read = true WHERE id = $1;`,
        [id]
      );
      sendSuccess(res, { message: 'Notification marked as read', id });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Marks all user notifications as read.
   */
  async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (userId) {
        await query(
          `UPDATE notifications SET is_read = true WHERE user_id = $1 OR user_id IS NULL;`,
          [userId]
        );
      }
      sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dismisses / deletes a notification.
   */
  async dismiss(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await query(`DELETE FROM notifications WHERE id = $1;`, [id]);
      sendSuccess(res, { message: 'Notification dismissed', id });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Utility to trigger a notification from anywhere in backend services.
   */
  static async pushNotification(params: {
    userId?: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
  }): Promise<void> {
    try {
      const type = params.type || 'status_update';
      const insertRes = await query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, user_id, title, message, type, link, created_at;`,
        [params.userId || null, params.title, params.message, type, params.link || null]
      );

      const created = insertRes.rows[0];
      NotificationManager.broadcast({
        id: created.id,
        userId: created.user_id,
        title: created.title,
        message: created.message,
        type: created.type,
        link: created.link,
        createdAt: created.created_at,
      });
    } catch (err: any) {
      console.warn('[NotificationController] Failed to push notification:', err.message);
    }
  }
}

export const notificationController = new NotificationController();
