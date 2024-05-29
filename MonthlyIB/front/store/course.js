import { coursePostItem } from "@/apis/courseAPI";
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
    session
  ) => {
    try {
      const res = coursePostItem(
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
      get().getCourseList(0, "", "", "", "", "");
    } catch (error) {
      console.error(error);
    }
  },
}));
