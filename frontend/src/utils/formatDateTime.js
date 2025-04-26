const options = {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

export const formatDateTime = (ISOstring) => {
  const date = new Date(ISOstring);
  return date.toLocaleString("en-IN", options);
};
