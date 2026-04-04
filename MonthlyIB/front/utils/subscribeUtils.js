export const isActiveSubscribe = (subscribe) =>
  subscribe?.subscribeStatus === "ACTIVE";

export const hasQuestionAccess = (subscribe) =>
  isActiveSubscribe(subscribe) &&
  (subscribe?.unlimitedQuestions || Number(subscribe?.questionCount || 0) > 0);

export const hasTutoringAccess = (subscribe) =>
  isActiveSubscribe(subscribe) &&
  (subscribe?.unlimitedTutoring || Number(subscribe?.tutoringCount || 0) > 0);

export const hasCourseAccess = (subscribe, courseId) =>
  isActiveSubscribe(subscribe) &&
  (subscribe?.unlimitedVideoLessons ||
    (subscribe?.videoLessonsIdList || []).includes(Number(courseId)));

export const canEnrollCourse = (subscribe, courseId) =>
  isActiveSubscribe(subscribe) &&
  (subscribe?.unlimitedVideoLessons ||
    hasCourseAccess(subscribe, courseId) ||
    Number(subscribe?.videoLessonsCount || 0) > 0);

export const formatQuotaSummary = (count, unlimited, unit) =>
  unlimited ? `${unit} 무한` : `${unit} ${Number(count || 0)}${unit === "강의" ? "과목" : "회"}`;

export const getPlanBenefitLines = (plan) => {
  if (!plan) return [];

  const lines = [
    formatQuotaSummary(plan.questionCount, plan.unlimitedQuestions, "질문"),
    formatQuotaSummary(plan.tutoringCount, plan.unlimitedTutoring, "튜터링"),
    formatQuotaSummary(
      plan.videoLessonsCount,
      plan.unlimitedVideoLessons,
      "강의"
    ),
  ];

  const extraContent = String(plan.content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return [...lines, ...extraContent];
};
