import React from "react";
import DateTimeFormat from "../dtf";

export default function DataTimeFormat({
  children,
  sep = "-",
  dateOnly = false,
  timeOnly = false,
}) {
  const dt = DateTimeFormat(children, sep, dateOnly, timeOnly);

  return <>{dt}</>;
}
