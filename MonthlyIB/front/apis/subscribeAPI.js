import { tokenRequireApi } from "./refreshToken";

const SUBSCRIBE_API_URL = "api/subscribe";

export const subscribeDeleteItem = async (subscribeId, session) => {//subscribe.js
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${SUBSCRIBE_API_URL}/${subscribeId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const subscribeGetUserInfo = async (userId, page, session) => {//user.js
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${SUBSCRIBE_API_URL}/${userId}?page=${page}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const subscribeActiveUserInfo = async (userId,session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${SUBSCRIBE_API_URL}/active/${userId}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const subscribeReviseItem = async (subscribeId, payload, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.patch(
      `${SUBSCRIBE_API_URL}/${subscribeId}`,
      payload,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const subscribePostItem = async (payload, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.post(`${SUBSCRIBE_API_URL}`, payload, config);
  } catch (error) {
    console.error(error);
  }
};

export const subscribePostUser = async (userId, subscribeId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {};
    const res = await tokenRequireApi.post(
      `${SUBSCRIBE_API_URL}/user/${userId}/${subscribeId}`,
      data,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const subscribeReviseUser = async (
  subscribeUserId,
  payload,
  session,
  newsubscribeId
  ) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.patch(
      `${SUBSCRIBE_API_URL}/user/${subscribeUserId}?newsubscribeId=${newsubscribeId}`,
      payload,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
