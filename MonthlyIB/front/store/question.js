import { questionGetItem, questionGetList } from "@/apis/openAPI";
import {
  questionDelete,
  questionDeleteAnswer,
  questionGetUserList,
  questionPostAnswerItem,
  questionPostItem,
  questionReviseAnswerItem,
  questionReviseItem,
} from "@/apis/questionAPI";
import { create } from "zustand";

export const useQuestionStore = create((set, get) => ({
  questionList: {},
  questionDetail: {},
  getQuestionList: async (currentPage, keyword) => {
    try {
      const res = await questionGetList("", keyword, currentPage - 1);
      set({ questionList: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getUserQuestionList: async (questionStatus, page, keyWord, session) => {
    try {
      const res = await questionGetUserList(
        questionStatus,
        page,
        keyWord,
        session
      );
      set({ questionList: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  getQuestionDetail: async (pageId) => {
    try {
      const res = await questionGetItem(pageId);
      set({ questionDetail: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  postQuestionItem: async (title, content, subject, session, currentPage) => {
    try {
      const res = await questionPostItem(
        title,
        content,
        subject,
        session?.userId,
        session
      );
      get().getQuestionList(currentPage);
      return res;
    } catch (error) {
      console.error(error);
    }
  },

  reviseQuestionItem: async (
    questionId,
    title,
    content,
    subject,
    questionStatus,
    session
  ) => {
    try {
      const res = await questionReviseItem(
        questionId,
        title,
        content,
        subject,
        questionStatus,
        session
      );
      get().getQuestionDetail(questionId);
      return res;
    } catch (error) {
      console.error(error);
    }
  },
  deleteQuestionItem: async (questionId, session) => {
    try {
      await questionDelete(questionId, session);
      get().getUserQuestionList("", 0, "", session);
    } catch (error) {
      console.error(error);
    }
  },
  deleteQuestionAnswer: async (answerId, questionId, session) => {
    try {
      await questionDeleteAnswer(answerId, session);
      get().getQuestionDetail(questionId);
    } catch (error) {
      console.error(error);
    }
  },
  reviseQuestionAnswer: async (
    answerId,
    questionId,
    answerContent,
    session
  ) => {
    try {
      await questionReviseAnswerItem(answerId, answerContent, session);
      get().getQuestionDetail(questionId);
    } catch (error) {
      console.error(error);
    }
  },
  submitQuestionAnswer: async (pageId, answerContent, session) => {
    try {
      await questionPostAnswerItem(pageId, answerContent, session);
      get().getQuestionDetail(pageId);
    } catch (error) {
      console.error(error);
    }
  },
}));
