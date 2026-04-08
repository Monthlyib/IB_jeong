import { tokenRequireApi } from "./refreshToken";

const MONTHLYIB_API_URL = "api/monthly-ib";
const OPEN_MONTHLYIB_API_URL = "open-api/monthly-ib";

export const monthlyIBPostThumbnail = async (
  monthlyIbId,
  image,
  accessToken
) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    await tokenRequireApi.post(
      `${MONTHLYIB_API_URL}/monthly-ib-thumbnail/${monthlyIbId}`,
      formData,
      config
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBPostPDFFile = async (monthlyIbId, file, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    const res = await tokenRequireApi.post(
      `${MONTHLYIB_API_URL}/monthly-ib-pdf/${monthlyIbId}`,
      formData,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBUploadContentImage = async (image, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    const res = await tokenRequireApi.post(
      `${MONTHLYIB_API_URL}/content-image`,
      formData,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBPostItem = async (title, content, accessToken) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };
    const data = { title, content };
    const res = await tokenRequireApi.post(MONTHLYIB_API_URL, data, config);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBReviseItem = async (monthlyIbId, title, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content };
    const res = await tokenRequireApi.patch(
      `${MONTHLYIB_API_URL}/${monthlyIbId}`,
      data,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBGetItem = async (monthlyIbId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${MONTHLYIB_API_URL}/${monthlyIbId}`,
      config
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBDeleteItem = async (monthlyIbId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${MONTHLYIB_API_URL}/${monthlyIbId}`, config);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const monthlyIBGetPublicItem = async (monthlyIbId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${OPEN_MONTHLYIB_API_URL}/${monthlyIbId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export const getMonthlyIbPdfDownloadUrl = (monthlyIbId) =>
  `${process.env.NEXT_PUBLIC_API_URL}${OPEN_MONTHLYIB_API_URL}/${monthlyIbId}/pdf`;
