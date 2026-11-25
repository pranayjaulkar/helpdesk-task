import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotificationStore } from "../store/notificationStore";
import { formatDate } from "../utils/constants";

export default function Notifications() {
  const { notifications, fetchNotifications, markRead, markAllRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications().catch(() => {});
  }, [fetchNotifications]);

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {hasUnread && (
          <button
            onClick={() => markAllRead()}
            className="text-sm text-indigo-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        <ul className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`flex items-start justify-between gap-4 px-4 py-3 ${n.read ? "" : "bg-indigo-50/50"}`}
            >
              <div>
                {n.ticket ? (
                  <Link
                    to={`/tickets/${n.ticket}`}
                    onClick={() => !n.read && markRead(n._id)}
                    className="text-sm hover:text-indigo-600"
                  >
                    {n.message}
                  </Link>
                ) : (
                  <p className="text-sm">{n.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n._id)}
                  className="text-xs text-gray-500 hover:text-gray-800 shrink-0"
                >
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
