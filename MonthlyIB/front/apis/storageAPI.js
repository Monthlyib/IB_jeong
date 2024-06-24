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
    await tokenRequireApi.delete(`${STORAGE_API_URL}/${storageFileId}`, config);
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

export const storagePostFile = async (parentsFolderId, file, session) => {
  try {
    const formData = new FormData(); // formData 생성
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.post(
      `${STORAGE_API_URL}/file/${parentsFolderId}`,
      formData,
      config
    );

    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
