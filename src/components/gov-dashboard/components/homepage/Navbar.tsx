import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, CheckCheck, Sparkles, AlertCircle, Info, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { notificationApi, type AppNotification } from "../../../../services/api";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = isAuthenticated && user?.name ? user.name : "Jharkhand Govt Officer";
  const displayRole = isAuthenticated && user?.role ? (user.role.toUpperCase() === "ADMIN" ? "Nodal Officer / Admin" : "Government Admin") : "Department Executive";
  const initial = displayName.charAt(0).toUpperCase();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch of notifications for government role
    notificationApi.getNotifications("GOVERNMENT", user?.district)
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(() => {});

    // 2. Subscribe to real-time Server-Sent Events (SSE)
    const cleanupStream = notificationApi.streamNotifications((incoming) => {
      if (isMounted && incoming && incoming.id) {
        setNotifications((prev) => {
          if (prev.some((n) => n.id === incoming.id)) return prev;
          return [incoming, ...prev];
        });
      }
    });

    return () => {
      isMounted = false;
      cleanupStream();
    };
  }, [user?.district]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notificationApi.markAsRead().catch(() => {});
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    notificationApi.markAsRead(id).catch(() => {});
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notificationApi.markAsRead(id).catch(() => {});
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 shadow-xs">
      <div className="flex h-full items-center justify-between">
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search problems, districts, tickets..."
            className="
              w-full rounded-xl
              border border-slate-200
              bg-slate-50/80
              py-2 pl-10 pr-4
              text-xs sm:text-sm font-medium
              outline-none
              placeholder:text-slate-400
              focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10
              transition-all
            "
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          {/* Functional Notification Bell with Short Window Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="Government Notifications"
              className={`
                relative rounded-xl p-2.5 transition-colors
                ${notificationsOpen ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
              `}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="
                  absolute right-2 top-2
                  h-2.5 w-2.5
                  rounded-full
                  bg-red-500 ring-2 ring-white animate-pulse"
                />
              )}
            </button>

            {/* Notification Popup Window */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#10245e]">Government Alerts & Feeds</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No active alerts at this time.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`group relative flex items-start gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
                          notif.read
                            ? "bg-slate-50/60 hover:bg-slate-50"
                            : "bg-emerald-50/50 border border-emerald-100/80 hover:bg-emerald-50"
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${
                          notif.type === "alert"
                            ? "bg-rose-100 text-rose-700"
                            : notif.type === "verification"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {notif.type === "alert" ? (
                            <AlertCircle size={14} />
                          ) : notif.type === "verification" ? (
                            <Sparkles size={14} />
                          ) : (
                            <Info size={14} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-semibold ${notif.read ? "text-slate-700" : "text-[#10245e]"}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                            {notif.message}
                          </p>
                        </div>

                        <button
                          onClick={(e) => removeNotification(notif.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                          title="Dismiss"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                  <Link
                    to="/gov/alerts"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View All Department Alerts &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <Link to="/gov/settings" className="flex items-center gap-3 group">
            <div className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-emerald-100
              font-bold
              text-emerald-800
              ring-2 ring-emerald-500/20
              transition-transform duration-200 group-hover:scale-105
            ">
              {initial}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs sm:text-sm font-semibold text-[#10245e] max-w-[140px] truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500">
                {displayRole}
              </p>
            </div>

            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;