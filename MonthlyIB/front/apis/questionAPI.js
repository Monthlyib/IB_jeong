import { tokenRequireApi } from "./refreshToken";
const QUESTION_API_URL = "api/question";

export const questionDelete = async (questionId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${QUESTION_API_URL}/${questionId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const questionDeleteAnswer = async (answerId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${QUESTION_API_URL}/answer/${answerId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const questionGetUserList = async (
  questionStatus,
  page,
  keyWord,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.get(
      `${QUESTION_API_URL}?keyWord=${keyWord}&questionStatus=${questionStatus}&page=${page}`,
      config
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const questionReviseItem = async (
  questionId,
  title,
  content,
  subject,
  questionStatus,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { questionId, title, content, subject, questionStatus };
    await tokenRequireApi.patch(`${QUESTION_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const questionReviseAnswerItem = async (answerId, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { answerId, content };
    await tokenRequireApi.patch(`${QUESTION_API_URL}/answer`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const questionPostItem = async (
  title,
  content,
  subject,
  authorId,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content, subject, authorId };
    await tokenRequireApi.post(`${QUESTION_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const questionPostAnswerItem = async (questionId, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { questionId, content };
    await tokenRequireApi.post(`${QUESTION_API_URL}/answer`, data, config);
  } catch (error) {
    console.error(error);
  }
};
