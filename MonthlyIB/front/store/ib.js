import {
  monthlyIBDeleteItem,
  monthlyIBGetItem,
  monthlyIBReviseItem,
} from "@/apis/monthlyIbAPI";
import { monthlyIBGetList } from "@/apis/openAPI";
import { create } from "zustand";
export const useIBStore = create((set, get) => ({
  loading: true,
  success: false,
  error: null,
  ibPosts: [],
  ibPageInfo: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  },
  ibDetail: {},
  getIBList: async (currentPage, keyWord) => {
    set({ loading: true, error: null });
    try {
      const res = await monthlyIBGetList(keyWord, currentPage - 1);
      set({
        ibPosts: res?.data || [],
        ibPageInfo: res?.pageInfo || {
          page: Math.max(currentPage - 1, 0),
          size: 10,
          totalElements: 0,
          totalPages: 1,
        },
        loading: false,
        success: true,
        error: null,
      });
    } catch (error) {
      console.error(error);
      set({
        ibPosts: [],
        loading: false,
        success: false,
        error: error?.message || "월간 IB 목록을 불러오지 못했습니다.",
      });
    }
  },

  deleteIBList: async (num, session, currentPage, keyWord = "") => {
    try {
      await monthlyIBDeleteItem(num, session);
      await get().getIBList(currentPage, keyWord);
    } catch (error) {
      console.error(error);
      set({ error: error?.message || "월간 IB 삭제에 실패했습니다." });
      throw error;
    }
  },
  getIBItem: async (monthlyIbId, session) => {
    try {
      const res = await monthlyIBGetItem(monthlyIbId, session);
      set({ ibDetail: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  reviseItem: async (monthlyIbId, title, content, userInfo) => {
    try {
      const res = await monthlyIBReviseItem(monthlyIbId, title, content, userInfo);
      get().getIBItem(monthlyIbId, userInfo);
      return res;
    } catch (error) {
      console.error(error);
    }
  },
}));
