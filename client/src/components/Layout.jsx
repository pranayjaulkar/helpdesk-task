import { useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-gray-600 hover:text-gray-900"
  }`;

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetchNotifications().catch(() => {});
  }, [location.pathname, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-indigo-600">
              Helpdesk
            </Link>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>
                {user.role === "admin" ? "All Tickets" : "My Tickets"}
              </NavLink>
              <NavLink to="/notifications" className={linkClass}>
                Notifications
                {unread > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                    {unread}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 hidden sm:inline">
              {user.name}
              {user.role === "admin" && (
                <span className="ml-1 text-xs text-indigo-600">(admin)</span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
