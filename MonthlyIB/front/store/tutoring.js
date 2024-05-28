import {
  TutoringGetDate,
  TutoringGetDateSimple,
  TutoringPostItem,
} from "@/apis/tutoringAPI";
import { create } from "zustand";

export const useTutoringStore = create((set, get) => ({
  tutoringDateSimpleList: {},
  getTutoringDateList: async (date, status, page, session) => {
    try {
      const res = await TutoringGetDate(date, status, page, session);
      set({ tutoringDateList: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getTutoringDateSimpleList: async (date, session) => {
    try {
      const res = await TutoringGetDateSimple(date, session);
      set({ tutoringDateSimpleList: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  postTutoring: async (requestUserId, date, hour, minute, detail, session) => {
    try {
      await TutoringPostItem(
        requestUserId,
        date,
        hour,
        minute,
        detail,
        session
      );
    } catch (error) {
      console.error(error);
    }
  },
}));
