import { tokenRequireApi } from "./refreshToken";

const MONTHLYIB_API_URL = "api/monthly-ib";

export const monthlyIBPostThumbnail = async (
  monthlyIbId,
  image,
  accessToken
) => {
  try {
    const formData = new FormData(); // formData 생성
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
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBPostItem = async (title, accessToken) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };
    const data = { title };
    const res = await tokenRequireApi.post(MONTHLYIB_API_URL, data, config);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const monthlyIBReviseItem = async (monthlyIbId, title, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title };
    const res = await tokenRequireApi.patch(
      `${MONTHLYIB_API_URL}/${monthlyIbId}`,
      data,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
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
  }
};
