import { tokenRequireApi } from "./refreshToken";

const DESCRIPTIVE_TEST_API = "api/descriptive-test";

// 서술형 문제 등록 요청
export const createAiDescriptiveTest = async (data, session) => {
  try {
    const res = await tokenRequireApi.post(DESCRIPTIVE_TEST_API, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("createAiDescriptiveTest error:", error);
    throw error;
  }
};

// 서술형 문제 단건 조회 요청
export const getDescriptiveTest = async (subject, chapter, session) => {
  try {
    const url = `${DESCRIPTIVE_TEST_API}?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("getDescriptiveTest error:", error);
    throw error;
  }
};

// 서술형 문제 이미지 업로드 요청
export const uploadDescriptiveImage = async (id, image, session) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await tokenRequireApi.post(`${DESCRIPTIVE_TEST_API}/image/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("uploadDescriptiveImage error:", error);
    throw error;
  }
};

// 서술형 문제 전체 목록 요청
export const getDescriptiveTests = async ({ subject, chapter, page }, session) => {
  try {
    console.log("getDescriptiveTests", { subject, chapter, page });
    const url = `${DESCRIPTIVE_TEST_API}/list?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}&page=${page}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getDescriptiveTests error:", error);
    throw error;
  }
};

// 서술형 문제 이미지 삭제 요청
export const deleteDescriptiveImage = async (id, session) => {
  try {
    const res = await tokenRequireApi.delete(`${DESCRIPTIVE_TEST_API}/image/${id}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("deleteDescriptiveImage error:", error);
    throw error;
  }
};

// 서술형 문제 단건 조회 (id 기반)
export const getDescriptiveTestById = async (id, session) => {
  try {
    const res = await tokenRequireApi.get(`${DESCRIPTIVE_TEST_API}/${id}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    console.log("getDescriptiveTestById", res);
    return res.data?.data;
  } catch (error) {
    console.error("getDescriptiveTestById error:", error);
    throw error;
  }
};
// 서술형 문제 삭제 요청
export const deleteDescriptiveTest = async (id, session) => {
  try {
    const res = await tokenRequireApi.delete(`${DESCRIPTIVE_TEST_API}/${id}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("deleteDescriptiveTest error:", error);
    throw error;
  }
};

// 서술형 문제 수정 요청
export const updateDescriptiveTest = async (id, data, session) => {
  try {
    const res = await tokenRequireApi.patch(`${DESCRIPTIVE_TEST_API}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("updateDescriptiveTest error:", error);
    throw error;
  }
};

// 서술형 문제 단건 조회 요청 (subject, chapter 기반)
export const getSingleDescriptiveTest = async (subject, chapter, session) => {
  try {
    const url = `${DESCRIPTIVE_TEST_API}?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("getSingleDescriptiveTest error:", error);
    throw error;
  }
};

// 서술형 문제 진행 중인 세션 조회 요청
export const getActiveDescriptiveSession = async ({ subject, chapter }, session) => {
  try {
    const url = `/api/descriptive-quiz/active?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("getActiveDescriptiveSession error:", error);
    throw error;
  }
};
// 서술형 문제 한 문제 불러오기 (학생용)
export const getDescriptiveQuestion = async (subject, chapter, session) => {
  try {
    const url = `${DESCRIPTIVE_TEST_API}/start?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data?.data;
  } catch (error) {
    console.error("getDescriptiveQuestion error:", error);
    throw error;
  }
};

// 서술형 문제 답안 제출
export const submitDescriptiveAnswer = async ({ subject, chapter, questionId, answer }, session) => {
  try {
    const res = await tokenRequireApi.post(
      `${DESCRIPTIVE_TEST_API}/submit`,
      {
        subject,
        chapter,
        questionId,
        answer,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("submitDescriptiveAnswer error:", error);
    throw error;
  }
};

// 서술형 문제 답안 결과 조회
export const getDescriptiveAnswerResult = async (answerId, session) => {
  try {
    const res = await tokenRequireApi.get(`${DESCRIPTIVE_TEST_API}/result/${answerId}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    console.log("getDescriptiveAnswerResult", res);
    return res.data?.data;
  } catch (error) {
    console.error("getDescriptiveAnswerResult error:", error);
    throw error;
  }
};

// 서술형 문제 답안 수정
export const generateFeedback = async (answerId, session) => {
  try {
    const res = await tokenRequireApi.get(`${DESCRIPTIVE_TEST_API}/answer-feedback/${answerId}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("answer feedback generating error:", error);
    throw error;
  }
};