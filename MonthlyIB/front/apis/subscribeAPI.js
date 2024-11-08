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
  }
};

export const subscribeReviseItem = async (//subscribe.js
  subscribeId,
  title,
  content,
  price,
  questionCount,
  tutoringCount,
  subscribeMonthPeriod,
  videoLessonsCount,
  videoLessionsIdList,
  color,
  fontColor,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      title,
      content,
      price,
      questionCount,
      tutoringCount,
      subscribeMonthPeriod,
      videoLessonsCount,
      videoLessionsIdList,
      color,
      fontColor,
    };
    await tokenRequireApi.patch(
      `${SUBSCRIBE_API_URL}/${subscribeId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const subscribePostItem = async (//subscribe.js
  title,
  content,
  price,
  questionCount,
  tutoringCount,
  subscribeMonthPeriod,
  videoLessonsCount,
  videoLessionsIdList,
  color,
  fontColor,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      title,
      content,
      price,
      questionCount,
      tutoringCount,
      subscribeMonthPeriod,
      videoLessonsCount,
      videoLessionsIdList,
      color,
      fontColor,
    };
    await tokenRequireApi.post(`${SUBSCRIBE_API_URL}`, data, config);
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
  }
};

export const subscribeReviseUser = async (
  subscribeUserId,
  questionCount,
  tutoringCount,
  subscribeMonthPeriod,
  videoLessonsCount,
  videoLessionsIdList,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      questionCount,
      tutoringCount,
      subscribeMonthPeriod,
      videoLessonsCount,
      videoLessionsIdList,
    };
    await tokenRequireApi.patch(
      `${SUBSCRIBE_API_URL}/user/${subscribeUserId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};
