import { tokenRequireApi } from "./refreshToken";

const CHAPTER_TEST_API = "api/chapter-test";

// 문제 등록 요청
export const createAiChapterTest = async (data, session) => {
  try {
    const res = await tokenRequireApi.post(CHAPTER_TEST_API, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("createAiChapterTest error:", error);
    throw error;
  }
};

// 문제 수정 요청
export const updateAiChapterTest = async (id, data, session) => {
  try {
    const res = await tokenRequireApi.patch(`${CHAPTER_TEST_API}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("updateAiChapterTest error:", error);
    throw error;
  }
};

// 이미지 업로드 요청
export const uploadAiChapterImage = async (id, image, session) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await tokenRequireApi.post(`${CHAPTER_TEST_API}/image/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    });

    return res.data;
  } catch (error) {
    console.error("uploadAiChapterImage error:", error);
    throw error;
  }
};

// 문제 목록 요청
export const getChapterTests = async ({ subject, chapter, page }, session) => {
  try {
    const url = `${CHAPTER_TEST_API}/list?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}&page=${page}`;
    const res = await tokenRequireApi.get(url, {
      headers: {
        Authorization: session?.accessToken,
      },
    });

    return res.data;
  } catch (error) {
    console.error("getChapterTests error:", error);
    throw error;
  }
};

// 문제 삭제 요청
export const deleteChapterTest = async (id, session) => {
  try {
    const res = await tokenRequireApi.delete(`${CHAPTER_TEST_API}/${id}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data;
  } catch (error) {
    console.error("deleteChapterTest error:", error);
    throw error;
  }
};

// 문제 단건 조회 요청
export const getChapterTestById = async (id, session) => {
  try {
    const res = await tokenRequireApi.get(`${CHAPTER_TEST_API}/${id}`, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("getChapterTestById error:", error);
    throw error;
  }
};
