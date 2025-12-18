export const formatTime = (time) => {
  if (!time) return "-";

  const parts = time.split(":");
  if (parts.length < 2) return "-";

  let hour = Number(parts[0]);
  let minute = Number(parts[1]);

  if (isNaN(hour) || isNaN(minute)) return "-";

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;
};