import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  coursePosts: [],
  courseDetail: {},
  courseVideo: [],

  getCoursePostLoading: false,
  getCoursePostDone: false,
  getCoursePostError: null,

  getCourseDetailLoading: false,
  getCourseDetailDone: false,
  getCourseDetailError: null,

  getCourseVideoLoading: false,
  getCourseVideoDone: false,
  getCourseVideoError: null,

  addCoursePostLoading: false, // 강의포스팅
  addCoursePostDone: false,
  addCoursePostError: null,

  editCoursePostLoading: false, //강의 수정
  editCoursePostDone: false,
  editCoursePostError: null,

  deleteCoursePostLoading: false, //강의 삭제
  deleteCoursePostDone: false,
  deleteCoursePostError: null,

  addCourseReviewLoading: false,
  addCourseReviewDone: false,
  addCourseReviewError: null,

  deleteCourseReviewLoading: false,
  deleteCourseReviewDone: false,
  deleteCourseReviewError: null,

  editCourseReviewLoading: false,
  editCourseReviewDone: false,
  editCourseReviewError: null,

  likeCourseReviewLoading: false,
  likeCourseReviewDone: false,
  likeCourseReviewError: null,

  unlikeCourseReviewLoading: false,
  unlikeCourseReviewDone: false,
  unlikeCourseReviewError: null,
};

const coursePostSlice = createSlice({
  name: "coursePost",
  initialState,
  reducers: {
    addCoursePostRequest(state) {
      state.addCoursePostLoading = true;
      state.addCoursePostDone = false;
      state.addCoursePostError = null;
    },
    addCoursePostSuccess(state) {
      state.addCoursePostLoading = false;
      state.addCoursePostDone = true;
      state.getCoursePostDone = false;
      state.coursePosts = [];
    },
    addCoursePostFailure(state, action) {
      state.addCoursePostLoading = false;
      state.addCoursePostError = action.error;
    },

    editCoursePostRequest(state) {
      state.editCoursePostLoading = true;
      state.editCoursePostDone = false;
      state.editCoursePostError = null;
    },
    editCoursePostSuccess(state) {
      state.editCoursePostLoading = false;
      state.editCoursePostDone = true;
      state.getCoursePostDone = false;
      state.coursePosts = [];
    },
    editCoursePostFailure(state, action) {
      state.editCoursePostLoading = false;
      state.editCoursePostError = action.error;
    },

    deleteCoursePostRequest(state) {
      state.deleteCoursePostLoading = true;
      state.deleteCoursePostDone = false;
      state.deleteCoursePostError = null;
    },
    deleteCoursePostSuccess(state) {
      state.deleteCoursePostLoading = false;
      state.deleteCoursePostDone = true;
      state.getCoursePostDone = false;
      state.coursePosts = [];
    },
    deleteCoursePostFailure(state, action) {
      state.deleteCoursePostLoading = false;
      state.deleteCoursePostError = action.error;
    },

    getCourseDetailRequest(state) {
      state.getCourseDetailLoading = true;
      state.getCourseDetailDone = false;
      state.getCourseDetailError = null;
    },
    getCourseDetailSuccess(state, action) {
      state.getCourseDetailLoading = false;
      state.getCourseDetailDone = true;
      state.courseDetail = { ...action.payload };
    },
    getCourseDetailFailure(state, action) {
      state.getCourseDetailLoading = false;
      state.getCourseDetailError = action.error;
    },

    getCourseVideoRequest(state) {
      state.getCourseVideoLoading = true;
      state.getCourseVideoDone = false;
      state.getCourseVideoError = null;
    },
    getCourseVideoSuccess(state, action) {
      state.getCourseVideoLoading = false;
      state.getCourseVideoDone = true;
      state.courseVideo = [...action.payload];
    },
    getCourseVideoFailure(state, action) {
      state.getCourseVideoLoading = false;
      state.getCourseVideoError = action.error;
    },

    getCoursePostRequest(state) {
      state.getCoursePostLoading = true;
      state.getCoursePostDone = false;
      state.getCoursePostError = null;
    },
    getCoursePostSuccess(state, action) {
      state.getCoursePostLoading = false;
      state.getCoursePostDone = true;
      state.coursePosts = [...action.payload];
    },
    getCoursePostFailure(state, action) {
      state.getCoursePostLoading = false;
      state.getCoursePostError = action.error;
    },

    addCourseReviewRequest(state) {
      state.addCourseReviewLoading = true;
      state.addCourseReviewDone = false;
      state.addCourseReviewError = null;
    },
    addCourseReviewSuccess(state, action) {
      const postIndex = state.coursePosts.findIndex(
        (v) => v.id === action.payload.pageId
      );
      state.coursePosts[postIndex].CourseReview.unshift(action.payload);
      state.addCourseReviewLoading = false;
      state.addCourseReviewDone = true;
    },
    addCourseReviewFailure(state, action) {
      state.addCourseReviewLoading = false;
      state.addCourseReviewError = action.error;
    },

    deleteCourseReviewRequest(state) {
      state.deleteCourseReviewLoading = true;
      state.deleteCourseReviewDone = false;
      state.deleteCourseReviewError = null;
    },
    deleteCourseReviewSuccess(state, action) {
      const postIndex = state.coursePosts.findIndex(
        (v) => v.id === action.payload.pageId
      );
      state.coursePosts[postIndex].CourseReview = state.coursePosts[
        postIndex
      ].CourseReview.filter((v) => v.id !== action.payload.id);
      state.deleteCourseReviewLoading = false;
      state.deleteCourseReviewDone = true;
    },
    deleteCourseReviewFailure(state, action) {
      state.deleteCourseReviewLoading = false;
      state.deleteCourseReviewError = action.error;
    },

    editCourseReviewRequest(state) {
      state.editCourseReviewLoading = true;
      state.editCourseReviewDone = false;
      state.editCourseReviewError = null;
    },
    editCourseReviewSuccess(state, action) {
      const postIndex = state.coursePosts.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.coursePosts[postIndex].CourseReview.findIndex(
        (v) => v.id === action.payload.id
      );
      state.coursePosts[postIndex].CourseReview[commentIndex].content =
        action.payload.review;
      console.log(action.payload);
      state.coursePosts[postIndex].CourseReview[commentIndex].point =
        action.payload.points;
      state.editCourseReviewLoading = false;
      state.editCourseReviewDone = true;
    },
    editCourseReviewFailure(state, action) {
      state.editCourseReviewLoading = false;
      state.editCourseReviewError = action.error;
    },

    likeCourseReviewRequest(state) {
      state.likeCourseReviewLoading = true;
      state.likeCourseReviewDone = false;
      state.likeCourseReviewError = null;
    },
    likeCourseReviewSuccess(state, action) {
      const postIndex = state.coursePosts.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.coursePosts[postIndex].CourseReview.findIndex(
        (v) => v.id === action.payload.id
      );
      state.coursePosts[postIndex].CourseReview[commentIndex].heart.unshift(
        action.payload.User
      );
      state.likeCourseReviewLoading = false;
      state.likeCourseReviewDone = true;
    },
    likeCourseReviewFailure(state, action) {
      state.likeCourseReviewLoading = false;
      state.likeCourseReviewError = action.error;
    },

    unlikeCourseReviewRequest(state) {
      state.unlikeCourseReviewLoading = true;
      state.unlikeCourseReviewDone = false;
      state.unlikeCourseReviewError = null;
    },
    unlikeCourseReviewSuccess(state, action) {
      const postIndex = state.coursePosts.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.coursePosts[postIndex].CourseReview.findIndex(
        (v) => v.id === action.payload.id
      );
      state.coursePosts[postIndex].CourseReview[commentIndex].heart =
        state.coursePosts[postIndex].CourseReview[commentIndex].heart.filter(
          (v) => v.id !== action.payload.User.id
        );
      state.unlikeCourseReviewLoading = false;
      state.unlikeCourseReviewDone = true;
    },
    unlikeCourseReviewFailure(state, action) {
      state.unlikeCourseReviewLoading = false;
      state.unlikeCourseReviewError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.coursePost,
      };
    });
  },
});

export const coursePostActions = coursePostSlice.actions;
export default coursePostSlice.reducer;
