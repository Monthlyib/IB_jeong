import {
  monthlyIBDeleteItem,
  monthlyIBGetItem,
  monthlyIBReviseItem,
} from "@/apis/monthlyIbAPI";
import { monthlyIBGetList } from "@/apis/openAPI";
import { create } from "zustand";
export const useIBStore = create((set, get) => ({
  loading: false,
  success: false,
  error: null,
  ibPosts: [],
  ibDetail: {},
  getIBList: async (currentPage) => {
    try {
      const res = await monthlyIBGetList("", currentPage - 1);
      set({ ibPosts: res.data, loading: false, success: true });
    } catch (error) {
      console.error(error);
    }
  },

  deleteIBList: async (num, session, currentPage) => {
    try {
      await monthlyIBDeleteItem(num, session);
      get().getIBList(currentPage);
    } catch (error) {
      console.error(error);
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
  reviseItem: async (monthlyIbId, title, userInfo) => {
    try {
      const res = await monthlyIBReviseItem(monthlyIbId, title, userInfo);
      get().getIBItem(monthlyIbId, userInfo);
      return res;
    } catch (error) {
      console.error(error);
    }
  },
}));
