import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import Comments from "../components/Comments";
import ActivityLog from "../components/ActivityLog";
import {
  PRIORITIES,
  STATUSES,
  formatLabel,
  getErrorMessage,
} from "../utils/constants";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    ticket,
    activity,
    loading,
    fetchTicket,
    fetchActivity,
    deleteTicket,
    changeStatus,
    changePriority,
    addComment,
  } = useTicketStore();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicket(id).catch((err) => setError(getErrorMessage(err)));
    fetchActivity(id).catch(() => {});
  }, [id, fetchTicket, fetchActivity]);

  const run = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this ticket? This cannot be undone.")) return;
    run(async () => {
      await deleteTicket(id);
      navigate("/");
    });
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!ticket) return <Alert message={error || "Ticket not found"} />;

  const isAdmin = user.role === "admin";
  const isOwner = ticket.createdBy?._id === user._id;
  const canModify = isOwner && ticket.status === "open";

  const selectClass =
    "rounded-md border border-gray-300 px-2 py-1.5 text-sm bg-white";

  return (
    <div>
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Back to tickets
      </Link>

      <div className="mt-3">
        <Alert message={error} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl font-semibold">{ticket.title}</h1>
              <div className="flex gap-2">
                <Badge value={ticket.priority} />
                <Badge value={ticket.status} />
              </div>
            </div>
            {ticket.createdBy && (
              <p className="text-xs text-gray-500">
                Submitted by {ticket.createdBy.name} ({ticket.createdBy.email})
              </p>
            )}
            <p className="mt-4 whitespace-pre-wrap text-gray-700">
              {ticket.description}
            </p>

            {(canModify || isAdmin) && (
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4">
                {isAdmin ? (
                  <div className="flex flex-wrap gap-4">
                    <label className="text-sm">
                      <span className="block font-medium mb-1">Status</span>
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          run(() => changeStatus(id, e.target.value))
                        }
                        className={selectClass}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {formatLabel(s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="block font-medium mb-1">Priority</span>
                      <select
                        value={ticket.priority}
                        onChange={(e) =>
                          run(() => changePriority(id, e.target.value))
                        }
                        className={selectClass}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {formatLabel(p)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : (
                  <span />
                )}
                <div className="flex gap-3">
                  {canModify && (
                    <Link
                      to={`/tickets/${id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={handleDelete}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <Comments
            comments={ticket.comments || []}
            disabled={ticket.status === "closed"}
            onAdd={(message) => run(() => addComment(id, message))}
          />
        </div>

        <div className="space-y-6">
          <ActivityLog activity={activity} />
        </div>
      </div>
    </div>
  );
}
