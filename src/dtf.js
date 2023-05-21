export default function DateTimeFormat(
  v,
  sep = "-",
  dateOnly = false,
  timeOnly = false
) {
  const dt = new Date(v);
  const month = fillZero(dt.getMonth() + 1);
  const date = fillZero(dt.getDate());
  const hour = fillZero(dt.getHours());
  const minute = fillZero(dt.getMinutes());
  const secs = fillZero(dt.getSeconds());

  const datePart = `${dt.getFullYear()}${sep}${month}${sep}${date}`;
  const timePart = `${hour}:${minute}:${secs}`;

  if (dateOnly) {
    return datePart;
  }

  if (timeOnly) {
    return timePart;
  }

  return `${datePart} ${timePart}`;
}

export function fillZero(num, n = 2) {
  const numStr = "" + num;
  return numStr.padStart(n, "0");
}
