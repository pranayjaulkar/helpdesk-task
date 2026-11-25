import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-4xl font-bold text-gray-300">404</h1>
      <p className="text-gray-600">Page not found</p>
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
