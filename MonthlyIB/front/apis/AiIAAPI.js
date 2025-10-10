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
    console.log("토픽 추천 요청 결과:", res?.data);
    // 백엔드가 ResponseDto로 감싸는 구조 가정: { result, data: { ia_topics: [...] } }
    const topics = res?.data?.data?.ia_topics || res?.data?.ia_topics || res?.data?.data || [];
    console.log("ia_topics(normalized):", topics);
    return res?.data?.data;
  } catch (error) {
    console.error("fetchRecommendedTopics error:", error);
    throw error;
  }
};


/**
 * 가이드 생성 요청
 * - 권장 사용: createGuide({ subject, topic, session })
 *   - topic: 선택된 ia_topic 객체 전체(title/description 및 기타 키 포함)
 */
export const createGuide = async ({ subject, topic, interest_topic, session }) => {
  try {
    const url = `/api/ai/IA/topic-guide`;
    const res = await tokenRequireApi.post(
      url,
      { subject, interest_topic, topic },
      {
        headers: {
          Authorization: session?.accessToken,
        },
      }
    );
    console.log("가이드 생성 결과:", res?.data);
    // ResponseDto 래핑 가정: res.data.data = { guideId, ... }
    return res?.data?.data || null;
  } catch (error) {
    console.error("createGuide error:", error);
    throw error;
  }
};

export const postEnglishChatMessage = async ({
  prompt,
  subject,
  textType,        // 'literature' | 'language'
  responseMode,    // 'generative' | 'evaluative'
  session,
}) => {
  try {
    const url = `/api/ai/IA/english-chat`;
    const body = {
      subject: "Langauge A English",
      prompt,
      textType,
      responseMode,
    };
    console.log(body)
    const res = await tokenRequireApi.post(url, body, {
      headers: {
        Authorization: session?.accessToken,
      },
    });
    console.log("영어 채팅 응답:", res?.data);
    // ResponseDto 래핑 가정: { result, data: { reply: string, ... } } 또는 { reply: string }
    return res?.data?.data ?? res?.data ?? null;
  } catch (error) {
    console.error("postEnglishChatMessage error:", error);
    throw error;
  }
};