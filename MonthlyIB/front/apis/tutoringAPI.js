import { tokenRequireApi } from "./refreshToken";

const TUTORING_API_URL = "api/tutoring";

const getApiErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

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
    throw new Error(
      getApiErrorMessage(
        error,
        "예약 가능 시간을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
      )
    );
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
    const res = await tokenRequireApi.post(`${TUTORING_API_URL}`, data, config);
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      getApiErrorMessage(
        error,
        "튜터링 예약에 실패했습니다. 잠시 후 다시 시도해주세요."
      )
    );
  }
};

export const TutoringSyncCalendarItem = async (tutoringId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.post(
      `${TUTORING_API_URL}/${tutoringId}/calendar-sync`,
      {},
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const TUTORING_EMAIL_TEMPLATE_API_URL = `${TUTORING_API_URL}/email-template`;

export const getTutoringEmailTemplate = async (session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${TUTORING_EMAIL_TEMPLATE_API_URL}/active`,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTutoringEmailTemplate = async (
  templateId,
  subject,
  bodyTemplate,
  recipientMode,
  recipientEmail,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { subject, bodyTemplate, recipientMode, recipientEmail };
    const res = await tokenRequireApi.patch(
      `${TUTORING_EMAIL_TEMPLATE_API_URL}/${templateId}`,
      data,
      config
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
