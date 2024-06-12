import { tokenRequireApi } from "./refreshToken";

const SUBSCRIBE_API_URL = "api/subscribe";

export const subscribeDeleteItem = async (subscribeId, session) => {
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

export const subscribeGetUserList = async (userId, page, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.get(
      `${SUBSCRIBE_API_URL}/${userId}?page=${page}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const subscribeReviseItem = async (
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

export const subscribePostItem = async (
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
