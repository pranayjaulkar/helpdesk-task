import { formatDate, formatLabel } from "../utils/constants";

const describe = (log) => {
  const { action, meta = {} } = log;
  if (action === "ticket.created") {
    return "created the ticket";
  } else if (action === "ticket.updated") {
    return `updated ${Object.keys(meta.changes || {}).join(", ")}`;
  } else if (action === "ticket.status_changed") {
    return `changed status from ${formatLabel(meta.from)} to ${formatLabel(meta.to)}`;
  } else if (action === "ticket.priority_changed") {
    return `changed priority from ${formatLabel(meta.from)} to ${formatLabel(meta.to)}`;
  } else if (action === "ticket.resolved") {
    return "marked the ticket as resolved";
  } else if (action === "comment.added") {
    return "added a comment";
  } else {
    return action;
  }
};

export default function ActivityLog({ activity }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="font-semibold mb-4">Activity</h2>
      {activity.length === 0 ? (
        <p className="text-sm text-gray-500">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {activity.map((log) => (
            <li key={log._id} className="text-sm border-gray-200">
              <p>
                <span className="font-medium">
                  {log.actor?.name || "Someone"}
                </span>{" "}
                {describe(log)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(log.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
