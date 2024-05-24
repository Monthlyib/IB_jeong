import { TutoringPostItem } from "@/apis/tutoringAPI";
import { create } from "zustand";

export const useTutoringStore = create((set, get) => ({
  tutoringList: {},
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
