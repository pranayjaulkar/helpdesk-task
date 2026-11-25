import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTicketStore } from "../store/ticketStore";
import TicketForm from "../components/TicketForm";
import Alert from "../components/Alert";
import { getErrorMessage } from "../utils/constants";

export default function NewTicket() {
  const createTicket = useTicketStore((s) => s.createTicket);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (form) => {
    setError("");
    try {
      const ticket = await createTicket(form);
      navigate(`/tickets/${ticket._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; Back to tickets
      </Link>
      <h1 className="text-2xl font-semibold mt-2 mb-6">Raise a ticket</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Alert message={error} />
        <TicketForm onSubmit={handleSubmit} submitLabel="Submit ticket" />
      </div>
    </div>
  );
}
