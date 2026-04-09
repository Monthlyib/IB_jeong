import { tokenRequireApi } from "./refreshToken";

const MY_AI_HISTORY_API = "/api/ai-history/me";
const ADMIN_AI_HISTORY_API = "/api/admin/ai-history";

const buildConfig = (session) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: session?.accessToken,
  },
});

export const getMyAiHistory = async ({ toolType = "", page = 0, size = 20 }, session) => {
  const res = await tokenRequireApi.get(MY_AI_HISTORY_API, {
    ...buildConfig(session),
    params: {
      ...(toolType ? { toolType } : {}),
      page,
      size,
    },
  });
  return res.data;
};

export const getMyAiHistoryDetail = async (historyId, session) => {
  const res = await tokenRequireApi.get(`${MY_AI_HISTORY_API}/${historyId}`, buildConfig(session));
  return res.data;
};

export const getAdminAiHistory = async ({ userId, toolType = "", page = 0, size = 20 }, session) => {
  const res = await tokenRequireApi.get(ADMIN_AI_HISTORY_API, {
    ...buildConfig(session),
    params: {
      userId,
      ...(toolType ? { toolType } : {}),
      page,
      size,
    },
  });
  return res.data;
};

export const getAdminAiHistoryDetail = async (historyId, session) => {
  const res = await tokenRequireApi.get(`${ADMIN_AI_HISTORY_API}/${historyId}`, buildConfig(session));
  return res.data;
};
