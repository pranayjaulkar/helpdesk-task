import { formatLabel } from "../utils/constants";

const colors = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-700",
  low: "bg-gray-100 text-gray-600",
  medium: "bg-sky-100 text-sky-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default function Badge({ value }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[value] || "bg-gray-100"}`}
    >
      {formatLabel(value)}
    </span>
  );
}
