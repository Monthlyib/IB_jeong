import { newsGetItem, newsPost, newsReviseItem } from "@/apis/newsAPI";
import { newsGetList } from "@/apis/openAPI";
import { create } from "zustand";

export const useNewstore = create((set, get) => ({
  loading: false,
  success: false,
  error: null,
  newsDetail: {},
  newsList: [],
  getNewsList: async (currentPage) => {
    try {
      const res = await newsGetList(currentPage - 1, "");
      set({ newsList: res.data, loading: false, success: true });
    } catch (error) {
      console.error(error);
    }
  },
  getNewsDetail: async (pageId, session) => {
    set({ loading: true, success: false });
    try {
      const res = await newsGetItem(pageId, session);
      set({ newsDetail: res.data, loading: false, success: true });
      return res.data;
    } catch (error) {
      console.log(error);
      set({ error, loading: false, success: false });
    }
  },
  postNews: async (title, content, userInfo) => {
    try {
      await newsPost(title, content, userInfo);
      get().getNewsList(1);
    } catch (error) {
      console.error(error);
    }
  },
  reviseNews: async (newsId, title, content, userInfo) => {
    try {
      await newsReviseItem(newsId, title, content, userInfo);
      get().getNewsList(1);
    } catch (error) {
      console.error(error);
    }
  },
}));
