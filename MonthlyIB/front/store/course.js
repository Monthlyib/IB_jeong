import { coursePostItem, coursePostThumnail } from "@/apis/courseAPI";
import { courseGetItem, courseGetList } from "@/apis/openAPI";
import { create } from "zustand";

export const useCourseStore = create((set, get) => ({
  loading: false,
  success: false,
  error: null,
  coursePosts: [],
  courseDetail: {},
  getCourseList: async (
    currentPage,
    keyWord,
    status,
    firstCategoryId,
    secondCategoryId,
    thirdCategoryId
  ) => {
    try {
      const res = await courseGetList(
        currentPage - 1,
        keyWord,
        status,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId
      );
      set({ coursePosts: res.data, loading: false, success: true });
    } catch (error) {
      console.error(error);
    }
  },
  getCourseDetail: async (videoLessonsId) => {
    try {
      const res = await courseGetItem(videoLessonsId);
      set({ courseDetail: res.data, loading: false, success: true });
    } catch (error) {
      console.error(error);
    }
  },
  postCourseItem: async (
    title,
    content,
    lecturer,
    chapterInfo,
    duration,
    chapters,
    firstCategoryId,
    secondCategoryId,
    thirdCategoryId,
    image,
    session
  ) => {
    try {
      const res = await coursePostItem(
        title,
        content,
        lecturer,
        chapterInfo,
        duration,
        chapters,
        firstCategoryId,
        secondCategoryId,
        thirdCategoryId,
        session
      );
      if (res?.result.status === 200)
        coursePostThumnail(res?.data?.videoLessonsId, image, session);
      get().getCourseList(1, "", "", "", "", "");
    } catch (error) {
      console.error(error);
    }
  },
}));
