"use client";

export const formatSeconds = (value = 0) => {
  const totalSeconds = Math.max(0, Math.floor(Number(value) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export const flattenCourseLessons = (courseDetail = {}) =>
  (courseDetail?.chapters ?? []).flatMap((chapter, chapterIndex) =>
    (chapter?.subChapters ?? []).map((lesson, lessonIndex) => ({
      mainChapterId: chapter.chapterId,
      subChapterId: lesson.chapterId,
      mainChapterTitle: chapter.chapterTitle,
      chapterTitle: lesson.chapterTitle,
      chapterIndex,
      lessonIndex,
      videoFileUrl: lesson.videoFileUrl,
    }))
  );

export const buildLessonProgressMap = (progressSummary) =>
  Object.fromEntries(
    (progressSummary?.lessons ?? []).map((lesson) => [lesson.subChapterId, lesson])
  );

export const getLessonProgressLabel = (progress) => {
  if (!progress) {
    return "미시청";
  }

  if (progress.completed) {
    return "완료";
  }

  if ((progress.lastPositionSeconds ?? 0) > 0) {
    return `진행 중 ${formatSeconds(progress.lastPositionSeconds)}`;
  }

  return "미시청";
};

export const findLessonByIds = (
  courseDetail,
  mainChapterId,
  subChapterId
) =>
  flattenCourseLessons(courseDetail).find(
    (lesson) =>
      lesson.mainChapterId === Number(mainChapterId) &&
      lesson.subChapterId === Number(subChapterId)
  ) ?? null;

export const resolveCourseEntryTarget = (
  courseDetail,
  progressSummary,
  preferredTarget
) => {
  const lessons = flattenCourseLessons(courseDetail);
  if (lessons.length === 0) {
    return null;
  }

  const progressMap = buildLessonProgressMap(progressSummary);

  const tryResolve = (candidate) => {
    if (!candidate?.mainChapterId || !candidate?.subChapterId) {
      return null;
    }

    const target = findLessonByIds(
      courseDetail,
      candidate.mainChapterId,
      candidate.subChapterId
    );

    if (!target) {
      return null;
    }

    const progress = progressMap[target.subChapterId];

    return {
      ...target,
      positionSeconds:
        Number(candidate.positionSeconds ?? progress?.lastPositionSeconds) || 0,
    };
  };

  const preferredLesson = tryResolve(preferredTarget);
  if (preferredLesson) {
    return preferredLesson;
  }

  const resumeLesson = tryResolve(progressSummary?.resumeTarget);
  if (resumeLesson) {
    return resumeLesson;
  }

  const firstIncomplete = lessons.find(
    (lesson) => !progressMap[lesson.subChapterId]?.completed
  );
  if (firstIncomplete) {
    return {
      ...firstIncomplete,
      positionSeconds:
        Number(progressMap[firstIncomplete.subChapterId]?.lastPositionSeconds) || 0,
    };
  }

  return {
    ...lessons[0],
    positionSeconds:
      Number(progressMap[lessons[0].subChapterId]?.lastPositionSeconds) || 0,
  };
};

export const getPlayerUrl = (courseId, target) => {
  if (!target?.mainChapterId || !target?.subChapterId) {
    return `/course/player/${courseId}`;
  }

  const params = new URLSearchParams();
  params.set("mainChapterId", String(target.mainChapterId));
  params.set("subChapterId", String(target.subChapterId));
  return `/course/player/${courseId}?${params.toString()}`;
};

export const isYouTubeVideoUrl = (videoFileUrl = "") => {
  try {
    const parsed = new URL(videoFileUrl);
    return (
      parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")
    );
  } catch (error) {
    return false;
  }
};

export const extractYouTubeVideoId = (videoFileUrl = "") => {
  try {
    const parsed = new URL(videoFileUrl);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || "";
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/embed/")[1] || "";
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1] || "";
    }

    return parsed.searchParams.get("v") || "";
  } catch (error) {
    return "";
  }
};
