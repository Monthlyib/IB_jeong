import { tokenRequireApi } from "./refreshToken";

const DESCRIPTIVE_TEST_API = "api/ai/IA";


// 주제 추천 요청
export const fetchRecommendedTopics = async (subject, interest, session) => {
  try {
    const url = `/api/ai/IA/recommend-topic`;
    const res = await tokenRequireApi.post(
      url,
      { subject, interest },
      {
        headers: {
          Authorization: session?.accessToken,
        },
      }
    );
    console.log("토픽 추천 요청 결과:", res);
    console.log(res.data.ia_topics);
    return res.data.data || [];
  } catch (error) {
    console.error("fetchRecommendedTopics error:", error);
    throw error;
  }
};