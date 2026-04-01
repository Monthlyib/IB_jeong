import { tokenRequireApi } from "./refreshToken";

const OPEN_API_URL = "open-api/home-layout";
const ADMIN_HOME_LAYOUT_API_URL = "api/admin/home-layout";

const buildSessionConfig = (session, extra = {}) => ({
  headers: {
    Authorization: session?.accessToken,
    ...extra,
  },
});

export const openAPIGetHomeLayout = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_API_URL}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch home layout: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("openAPIGetHomeLayout error:", error);
    return null;
  }
};

export const adminGetHomeLayout = async (session) => {
  const config = buildSessionConfig(session);
  const response = await tokenRequireApi.get(ADMIN_HOME_LAYOUT_API_URL, config);
  return response.data;
};

export const adminSaveHomeLayoutDraft = async (layout, session) => {
  const config = buildSessionConfig(session, {
    "Content-Type": "application/json",
  });
  const response = await tokenRequireApi.put(
    `${ADMIN_HOME_LAYOUT_API_URL}/draft`,
    layout,
    config
  );
  return response.data;
};

export const adminPublishHomeLayout = async (session) => {
  const config = buildSessionConfig(session, {
    "Content-Type": "application/json",
  });
  const response = await tokenRequireApi.post(
    `${ADMIN_HOME_LAYOUT_API_URL}/publish`,
    {},
    config
  );
  return response.data;
};

export const adminResetHomeLayoutDraft = async (session) => {
  const config = buildSessionConfig(session, {
    "Content-Type": "application/json",
  });
  const response = await tokenRequireApi.post(
    `${ADMIN_HOME_LAYOUT_API_URL}/reset`,
    {},
    config
  );
  return response.data;
};

export const adminUploadHomeLayoutMedia = async (file, session) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = buildSessionConfig(session);
  const response = await tokenRequireApi.post(
    `${ADMIN_HOME_LAYOUT_API_URL}/media`,
    formData,
    config
  );
  return response.data;
};
