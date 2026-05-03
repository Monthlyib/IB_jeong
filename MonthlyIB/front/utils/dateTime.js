const ISO_ZONE_SUFFIX = /(Z|[+-]\d{2}:?\d{2})$/;

export const parseServerDateTime = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const rawValue = String(value).trim();
  if (!rawValue) return null;

  const normalizedValue = rawValue
    .replace(" ", "T")
    .replace(/\.(\d{3})\d+/, ".$1");
  const zonedValue = ISO_ZONE_SUFFIX.test(normalizedValue)
    ? normalizedValue
    : `${normalizedValue}Z`;
  const parsed = new Date(zonedValue);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatKoreaDateTime = (value) => {
  const parsed = parseServerDateTime(value);
  if (!parsed) return "";

  return parsed.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
