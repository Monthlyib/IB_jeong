import { tokenRequireApi } from "./refreshToken";
const NEWS_API_URL = "api/news";

export const newsDeleteItem = async (newsId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${NEWS_API_URL}/${newsId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const newsGetItem = async (newsId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(`${NEWS_API_URL}/${newsId}`, config);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const newsReviseItem = async (newsId, title, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content };
    await tokenRequireApi.patch(`${NEWS_API_URL}/${newsId}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const newsPost = async (title, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content };
    await tokenRequireApi.post(`${NEWS_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const newsFilePost = async (newsId, session, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    await tokenRequireApi.post(
      `${NEWS_API_URL}/news-file/${newsId}`,
      formData,
      config
    );
  } catch (error) {
    console.error(error);
  }
};
