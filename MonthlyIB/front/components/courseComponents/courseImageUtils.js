export const COURSE_THUMBNAIL_FALLBACK = "/img/common/user_profile.jpg";

export const normalizeCourseThumbnailUrl = (value) => {
  const url = typeof value === "string" ? value.trim() : "";

  if (!url || url === "null" || url === "undefined") {
    return COURSE_THUMBNAIL_FALLBACK;
  }

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  return `/${url.replace(/^\/+/, "")}`;
};
