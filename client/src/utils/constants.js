export const STATUSES = ["open", "in_progress", "resolved", "closed"];
export const PRIORITIES = ["low", "medium", "high", "urgent"];
export const CATEGORIES = [
  "technical",
  "billing",
  "account",
  "general",
  "other",
];

export const formatLabel = (value = "") =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const formatDate = (date) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(", ");
  return data?.message || err.message || "Something went wrong";
};
