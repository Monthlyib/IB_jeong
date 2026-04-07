import {
  TutoringDeleteItem,
  TutoringGetDate,
  TutoringGetDateSimple,
  TutoringPostItem,
  TutoringReviseItem,
} from "@/apis/tutoringAPI";
import { create } from "zustand";

export const useTutoringStore = create((set, get) => ({
  tutoringDateSimpleList: {},
  tutoringDateList: [],
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
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  postTutoring: async (requestUserId, date, hour, minute, detail, session) => {
    try {
      return await TutoringPostItem(
        requestUserId,
        date,
        hour,
        minute,
        detail,
        session
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  reviseTutoring: async (tutoringId, detail, tutoringStatus, session, page) => {
    try {
      await TutoringReviseItem(tutoringId, detail, tutoringStatus, session);
      get().getTutoringDateList("", "", Math.max(page - 1, 0), session);
    } catch (error) {
      console.error(error);
    }
  },

  deleteTutoring: async (tutoringId, session, page) => {
    try {
      await TutoringDeleteItem(tutoringId, session);
      get().getTutoringDateList("", "", Math.max(page - 1, 0), session);
    } catch (error) {
      console.error(error);
    }
  },
}));
