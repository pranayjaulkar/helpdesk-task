import { useState } from "react";
import { formatDate } from "../utils/constants";

export default function Comments({ comments, disabled, onAdd }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await onAdd(message);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="font-semibold mb-4">Comments ({comments.length})</h2>

      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div
            key={c._id}
            className={`rounded-md p-3 text-sm ${c.author?.role === "admin" ? "bg-indigo-50" : "bg-gray-50"}`}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">
                {c.author?.name || "Deleted user"}
                {c.author?.role === "admin" && (
                  <span className="ml-1 text-xs">(Support)</span>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(c.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-gray-700">{c.message}</p>
          </div>
        ))}
      </div>

      {disabled ? (
        <p className="text-sm text-gray-500">
          This ticket is closed. Comments are disabled.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a comment..."
            maxLength={2000}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            disabled={sending || !message.trim()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {sending ? "Posting..." : "Add comment"}
          </button>
        </form>
      )}
    </div>
  );
}
