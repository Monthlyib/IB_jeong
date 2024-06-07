import { tokenRequireApi } from "./refreshToken";

const TUTORING_API_URL = "api/tutoring";

export const TutoringDeleteItem = async (tutoringId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${TUTORING_API_URL}/${tutoringId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetUserData = async (userId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${TUTORING_API_URL}/user/${userId}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetTime = async (date, hour, minute, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${TUTORING_API_URL}/time?date=${date}&hour=${hour}&minute=${minute}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetDate = async (date, status, page, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${TUTORING_API_URL}/date?date=${date}&status=${status}&page=${page}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const TutoringGetDateSimple = async (date, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${TUTORING_API_URL}/date-simple?date=${date}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const TutoringReviseItem = async (
  tutoringId,
  detail,
  tutoringStatus,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { detail, tutoringStatus };
    await tokenRequireApi.patch(
      `${TUTORING_API_URL}/${tutoringId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const TutoringPostItem = async (
  requestUserId,
  date,
  hour,
  minute,
  detail,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { requestUserId, date, hour, minute, detail };
    await tokenRequireApi.post(`${TUTORING_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};
