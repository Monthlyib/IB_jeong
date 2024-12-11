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
    title,
    content,
    price,
    questionCount,
    tutoringCount,
    subscribeMonthPeriod,
    videoLessonsCount,
    videoLessionsIdList,
    color,
    fontColor,
    session,
    premium
  ) => {
    try {
      await subscribeReviseItem(
        subscribeId,
        title,
        content,
        price,
        questionCount,
        tutoringCount,
        subscribeMonthPeriod,
        videoLessonsCount,
        videoLessionsIdList,
        color,
        fontColor,
        session,
        premium
      );
      get().getSubscribeList();
    } catch (error) {
      console.error(error);
    }
  },
  postSubscribeItem: async (
    title,
    content,
    price,
    questionCount,
    tutoringCount,
    subscribeMonthPeriod,
    videoLessonsCount,
    videoLessionsIdList,
    color,
    fontColor,
    session,
    Premium
  ) => {
    console.log(
      title,
      content,
      price,
      questionCount,
      tutoringCount,
      subscribeMonthPeriod,
      videoLessonsCount,
      videoLessionsIdList,
      color,
      fontColor,
      session,
      Premium
    );
    try {
      await subscribePostItem(
        title,
        content,
        price,
        questionCount,
        tutoringCount,
        subscribeMonthPeriod,
        videoLessonsCount,
        videoLessionsIdList,
        color,
        fontColor,
        session,
        Premium
      );
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
