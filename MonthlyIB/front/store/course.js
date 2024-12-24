import {
  courseDeleteItem,
  courseDeleteRelpyItem,
  coursePostItem,
  coursePostRelpyItem,
  coursePostThumnail,
  courseReviseRelpyItem,
  courseUserList,
  courseVoteRelpyItem,
} from "@/apis/courseAPI";
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
      console.log(res.data);
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
      if (res?.result.status === 200 && image)
        coursePostThumnail(res?.data?.videoLessonsId, image, session);
      await get().getCourseList(1, "", "", "", "", "");
    } catch (error) {
      console.error(error);
    }
  },
  postCourseReview: async (
    videoLessonsId,
    authorId,
    content,
    star,
    session
  ) => {
    try {
      await coursePostRelpyItem(
        videoLessonsId,
        authorId,
        content,
        star,
        session
      );
      get().getCourseDetail(videoLessonsId);
    } catch (error) {
      console.error(error);
    }
  },
  deleteCourseItem: async (pageId, userInfo) => {
    try {
      await courseDeleteItem(pageId, userInfo);
      get().getCourseList(1, "", "", "", "", "");
    } catch (error) {
      console.error(error);
    }
  },
  deleteCourseReview: async (videoLessonsId, videoLessonsReplyId, session) => {
    try {
      await courseDeleteRelpyItem(videoLessonsReplyId, session);
      get().getCourseDetail(videoLessonsId);
    } catch (error) {
      console.error(error);
    }
  },
  reviseCourseReview: async (
    videoLessonsId,
    videoLessonsReplyId,
    content,
    star,
    session
  ) => {
    try {
      await courseReviseRelpyItem(
        videoLessonsId,
        videoLessonsReplyId,
        content,
        star,
        session
      );
      get().getCourseDetail(videoLessonsId);
    } catch (error) {
      console.error(error);
    }
  },
  voteCourseReview: async (videoLessonsId, videoLessonsReplyId, session) => {
    try {
      await courseVoteRelpyItem(videoLessonsReplyId, session);
      get().getCourseDetail(videoLessonsId);
    } catch (error) {
      console.error(error);
    }
  },
  getUserCourseList: async (userId, page, session) => {
    try {
      const res = await courseUserList(userId, page, session);
      set({ coursePosts: res.data });
    } catch (error) {
      console.error(error);
    }
  },
}));
