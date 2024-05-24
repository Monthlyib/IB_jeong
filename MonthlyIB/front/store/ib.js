import { monthlyIBDeleteItem, monthlyIBGetItem } from "@/api/monthlyIbAPI";
import { monthlyIBGetList } from "@/api/openAPI";
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
}));
