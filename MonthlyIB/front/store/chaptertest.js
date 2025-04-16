import { create } from "zustand";
import { startQuizSession } from "@/apis/AiChapterTestAPI";

export const useChapterTestStore = create((set) => ({
  quizSession: null,
  setQuizSession: (sessionData) => set({ quizSession: sessionData }),
  resetQuizSession: () => set({ quizSession: null }),
  fetchAndSetQuizSession: async (request, session) => {
    try {
      const result = await startQuizSession(request, session);
      set({ quizSession: result.data });
      console.log("퀴즈 세션 생성 성공:", result.data);
      return result.data;
    } catch (error) {
      console.error("퀴즈 세션 생성 실패:", error);
      throw error;
    }
  },
}));
