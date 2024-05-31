import axios from "axios";

const STORAGE_API_URL = "api/storage";

export const storageDeleteFolder = async (storageFolderId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${STORAGE_API_URL}/${storageFolderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const storageDeleteFile = async (storageFileId, session) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${STORAGE_API_URL}/file/${storageFileId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${STORAGE_API_URL}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ storageFolderId, folderName, status }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${STORAGE_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ parentsFolderId, folderName, status }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
    return res.json();
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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${STORAGE_API_URL}/file/${parentsFolderId}`,
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
