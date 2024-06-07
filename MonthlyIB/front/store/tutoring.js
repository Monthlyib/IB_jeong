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
  reviseTutoring: async (tutoringId, detail, tutoringStatus, session, page) => {
    try {
      await TutoringReviseItem(tutoringId, detail, tutoringStatus, session);
      get().getTutoringDateList("", "", page - 1, session);
    } catch (error) {
      console.error(error);
    }
  },

  deleteTutoring: async (tutoringId, session, page) => {
    try {
      await TutoringDeleteItem(tutoringId, session);
      get().getTutoringDateList("", "", page - 1, session);
    } catch (error) {
      console.error(error);
    }
  },
}));
