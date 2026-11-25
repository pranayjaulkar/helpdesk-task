import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTicketStore } from "../store/ticketStore";
import TicketForm from "../components/TicketForm";
import Alert from "../components/Alert";
import { getErrorMessage } from "../utils/constants";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, loading, fetchTicket, updateTicket } = useTicketStore();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicket(id).catch((err) => setError(getErrorMessage(err)));
  }, [id, fetchTicket]);

  const handleSubmit = async (form) => {
    setError("");
    try {
      await updateTicket(id, form);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Link
        to={`/tickets/${id}`}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Back to ticket
      </Link>
      <h1 className="text-2xl font-semibold mt-2 mb-6">Edit ticket</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Alert message={error} />
        {ticket && ticket.status !== "open" ? (
          <p className="text-sm text-gray-600">
            Only open tickets can be edited.
          </p>
        ) : (
          ticket && (
            <TicketForm
              initial={ticket}
              onSubmit={handleSubmit}
              submitLabel="Save changes"
            />
          )
        )}
      </div>
    </div>
  );
}
