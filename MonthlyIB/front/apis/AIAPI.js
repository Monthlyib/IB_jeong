import { tokenRequireApi } from "./refreshToken";

const AI_API_URL = "api/chatgpt-feedback";

// FormData에 담긴 데이터를 백엔드로 전송해 ChatGPT 피드백을 받아오는 함수
export const sendFeedbackRequest = async (formData, session) => {
  try {
    const config = {
      headers: {
        // FormData를 전송할 때는 Content-Type을 "multipart/form-data"로 지정합니다.
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    };
    const res = await tokenRequireApi.post(`${AI_API_URL}`, formData, config);
    return res.data;
  } catch (error) {
    console.error("Feedback request error:", error);
    throw error;
  }
};