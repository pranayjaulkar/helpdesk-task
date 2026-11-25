import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function GuestRoute() {
  const user = useAuthStore((s) => s.user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
