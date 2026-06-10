import { tokenRequireApi } from "./refreshToken";

const ACCESS_ANALYTICS_API_URL = "api/admin/access-analytics";

const authConfig = (session) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: session?.accessToken,
  },
});

export const getAdminAccessAnalyticsOverview = async (session, days = 30, weeks = 12) => {
  const res = await tokenRequireApi.get(
    `${ACCESS_ANALYTICS_API_URL}/overview?days=${days}&weeks=${weeks}`,
    authConfig(session)
  );
  return res.data?.data;
};

export const getAdminAccessAnalyticsDetails = async (session, periodType, period) => {
  const res = await tokenRequireApi.get(
    `${ACCESS_ANALYTICS_API_URL}/details?periodType=${periodType}&period=${period}`,
    authConfig(session)
  );
  return res.data?.data;
};
