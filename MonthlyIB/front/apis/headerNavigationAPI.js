import { tokenRequireApi } from "./refreshToken";

const OPEN_API_URL = "open-api/header-navigation";
const ADMIN_API_URL = "api/admin/header-navigation";

const buildSessionConfig = (session, extra = {}) => ({
  headers: {
    Authorization: session?.accessToken,
    ...extra,
  },
});

export const openAPIGetHeaderNavigation = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch header navigation: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("openAPIGetHeaderNavigation error:", error);
    return null;
  }
};

export const adminGetHeaderNavigation = async (session) => {
  const config = buildSessionConfig(session);
  const response = await tokenRequireApi.get(ADMIN_API_URL, config);
  return response.data;
};

export const adminSaveHeaderNavigation = async (payload, session) => {
  const config = buildSessionConfig(session, {
    "Content-Type": "application/json",
  });
  const response = await tokenRequireApi.put(ADMIN_API_URL, payload, config);
  return response.data;
};
