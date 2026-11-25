import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import {
  PRIORITIES,
  STATUSES,
  formatDate,
  formatLabel,
  getErrorMessage,
} from "../utils/constants";

export default function Tickets() {
  const user = useAuthStore((s) => s.user);
  const { tickets, loading, fetchTickets } = useTicketStore();
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";

  useEffect(() => {
    fetchTickets(filters)
      .then(() => setError(""))
      .catch((err) => setError(getErrorMessage(err)));
  }, [filters, fetchTickets]);

  const selectClass =
    "rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">
          {isAdmin ? "All Tickets" : "My Tickets"}
        </h1>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatLabel(s)}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className={selectClass}
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {formatLabel(p)}
              </option>
            ))}
          </select>
          {!isAdmin && (
            <Link
              to="/tickets/new"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + New Ticket
            </Link>
          )}
        </div>
      </div>

      <Alert message={error} />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No tickets found.</p>
          {!isAdmin && (
            <Link
              to="/tickets/new"
              className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
            >
              Raise your first ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{ticket.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatLabel(ticket.category)} ·{" "}
                  {formatDate(ticket.createdAt)}
                  {isAdmin && ticket.createdBy && (
                    <> · by {ticket.createdBy.name}</>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge value={ticket.priority} />
                <Badge value={ticket.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
