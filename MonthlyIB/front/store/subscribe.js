import { subscribeGetList } from "@/apis/openAPI";
import {
  subscribeDeleteItem,
  subscribePostItem,
  subscribeReviseItem,
} from "@/apis/subscribeAPI";
import { create } from "zustand";

export const useSubscribeStore = create((set, get) => ({
  subscribeList: [],
  getSubscribeList: async () => {
    try {
      const res = await subscribeGetList();
      set({ subscribeList: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  editSubscribeItem: async (
    subscribeId,
    payload,
    session
  ) => {
    try {
      await subscribeReviseItem(subscribeId, payload, session);
      get().getSubscribeList();
    } catch (error) {
      console.error(error);
    }
  },
  postSubscribeItem: async (payload, session) => {
    try {
      await subscribePostItem(payload, session);
      get().getSubscribeList();
    } catch (error) {
      console.error(error);
    }
  },
  deleteSubscribeItem: async (subscribeId, session) => {
    try {
      await subscribeDeleteItem(subscribeId, session);
      get().getSubscribeList();
    } catch (error) {
      console.error(error);
    }
  },
}));
