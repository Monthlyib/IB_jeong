import { tokenRequireApi } from "./refreshToken";

const STORAGE_API_URL = "api/storage";

export const storageDeleteFolder = async (storageFolderId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${STORAGE_API_URL}/${storageFolderId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const storageDeleteFile = async (storageFileId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${STORAGE_API_URL}/file/${storageFileId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const storageReviseFolder = async (
  storageFolderId,
  folderName,
  status,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { storageFolderId, folderName, status };
    await tokenRequireApi.patch(STORAGE_API_URL, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const storagePostFolder = async (
  parentsFolderId,
  folderName,
  status,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { parentsFolderId, folderName, status };
    await tokenRequireApi.post(STORAGE_API_URL, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const storagePostFile = async (parentsFolderId, file, session, onProgress) => {
  const formData = new FormData();
  // backend expects @RequestParam("file")
  formData.append("file", file);

  const controller = new AbortController();

  const res = await tokenRequireApi.post(
    `${STORAGE_API_URL}/file/${parentsFolderId}`,
    formData,
    {
      headers: {
        Authorization: session?.accessToken,
      },
      signal: controller.signal,
      onUploadProgress: (evt) => {
        const total = evt?.total || file?.size || 0;
        const loaded = evt?.loaded || 0;
        const pct = total > 0 ? Math.min(100, Math.round((loaded * 100) / total)) : 0;
        if (onProgress) onProgress(pct);
      },
      timeout: 0,
    }
  );

  const cancel = (reason) => controller.abort(reason);
  return { res, cancel };
};
