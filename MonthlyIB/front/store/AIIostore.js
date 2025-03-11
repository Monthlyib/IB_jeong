// /store/AIIostore.js
import { create } from "zustand";
import { sendFeedbackRequestAPI } from "@/apis/AIAPI"; // AIAPI.js에서 정의한 함수 import

export const useIOStore = create((set, get) => ({
  iocTopic: "",
  workTitle: "",
  author: "",
  scriptFile: null,
  audioBlob: null, // 녹음 파일도 함께 관리

  setIocTopic: (iocTopic) => set({ iocTopic }),
  setWorkTitle: (workTitle) => set({ workTitle }),
  setAuthor: (author) => set({ author }),
  setScriptFile: (scriptFile) => set({ scriptFile }),
  setAudioBlob: (audioBlob) => set({ audioBlob }),

  // ChatGPT API와 통신하여 피드백을 받아오는 메소드
  sendFeedbackRequest: async (session) => {
    const { iocTopic, workTitle, author, scriptFile, audioBlob } = get();

    // 필수 항목 체크
    if (!iocTopic || !workTitle || !author || !scriptFile || !audioBlob) {
      throw new Error("필수 데이터가 모두 준비되지 않았습니다.");
    }

    try {
      // FormData에 텍스트 및 파일 데이터 추가
      const formData = new FormData();
      formData.append("iocTopic", iocTopic);
      formData.append("workTitle", workTitle);
      formData.append("author", author);
      formData.append("scriptFile", scriptFile);
      formData.append("audioFile", audioBlob);

      // AIAPI.js에 정의한 sendFeedbackRequestAPI 메소드를 호출
      const data = await sendFeedbackRequestAPI(formData, session);
      return data; // ChatGPT 피드백 결과 반환
    } catch (error) {
      console.error("Feedback request error:", error);
      throw error;
    }
  },
}));