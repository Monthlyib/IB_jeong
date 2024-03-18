import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  bulletinBoards: [],
  bulletinBoardDetail: { comments: [] },

  getBulletinBoardLoading: false,
  getBulletinBoardDone: false,
  getBulletinBoardError: null,

  getBulletinBoardDetailLoading: false,
  getBulletinBoardDetailDone: false,
  getBulletinBoardDetailError: null,

  addBulletinBoardLoading: false,
  addBulletinBoardDone: false,
  addBulletinBoardError: null,

  deleteBulletinBoardLoading: false,
  deleteBulletinBoardDone: false,
  deleteBulletinBoardError: null,

  editBulletinBoardLoading: false,
  editBulletinBoardDone: false,
  editBulletinBoardError: null,

  addBulletinBoardCommentsLoading: false,
  addBulletinBoardCommentsDone: false,
  addBulletinBoardCommentsError: null,

  likeBulletinBoardCommentsLoading: false,
  likeBulletinBoardCommentsDone: false,
  likeBulletinBoardCommentsError: null,

  unlikeBulletinBoardCommentsLoading: false,
  unlikeBulletinBoardCommentsDone: false,
  unlikeBulletinBoardCommentsError: null,

  deleteBulletinBoardCommentsLoading: false,
  deleteBulletinBoardCommentsDone: false,
  deleteBulletinBoardCommentsError: null,

  editBulletinBoardCommentsLoading: false,
  editBulletinBoardCommentsDone: false,
  editBulletinBoardCommentsError: null,
};

const bulletinBoardSlice = createSlice({
  name: "bulletinBoard",
  initialState,
  reducers: {
    addBulletinBoardRequest(state) {
      state.addBulletinBoardLoading = true;
      state.addBulletinBoardDone = false;
      state.addBulletinBoardError = null;
    },
    addBulletinBoardSuccess(state) {
      state.addBulletinBoardLoading = false;
      state.addBulletinBoardDone = true;
      state.getBulletinBoardLoading = false;
      state.getBulletinBoardDone = false;
      state.bulletinBoards = [];
    },
    addBulletinBoardFailure(state, action) {
      state.addBulletinBoardLoading = false;
      state.addBulletinBoardError = action.payload.error;
    },
    getBulletinBoardRequest(state) {
      state.getBulletinBoardLoading = true;
      state.getBulletinBoardDone = false;
      state.getBulletinBoardError = null;
    },
    getBulletinBoardSuccess(state, action) {
      state.bulletinBoards.unshift(...action.payload);
      state.getBulletinBoardLoading = false;
      state.getBulletinBoardDone = true;
    },
    getBulletinBoardFailure(state, action) {
      state.getBulletinBoardLoading = false;
      state.getBulletinBoardError = action.payload.error;
    },

    getBulletinBoardDetailRequest(state) {
      state.getBulletinBoardDetailLoading = true;
      state.getBulletinBoardDetailDone = false;
      state.getBulletinBoardDetailError = null;
    },
    getBulletinBoardDetailSuccess(state, action) {
      state.getBulletinBoardDetailLoading = false;
      state.getBulletinBoardDetailDone = true;
      console.log(action.payload);
      state.bulletinBoardDetail = action.payload;
    },
    getBulletinBoardDetailFailure(state, action) {
      state.getBulletinBoardDetailLoading = false;
      state.getBulletinBoardDetailError = action.payload.error;
    },
    deleteBulletinBoardRequest(state) {
      state.deleteBulletinBoardLoading = true;
      state.deleteBulletinBoardDone = false;
      state.deleteBulletinBoardError = null;
    },
    deleteBulletinBoardSuccess(state) {
      state.deleteBulletinBoardLoading = false;
      state.deleteBulletinBoardDone = true;
      state.getBulletinBoardDone = false;
    },
    deleteBulletinBoardFailure(state, action) {
      state.deleteBulletinBoardLoading = false;
      state.deleteBulletinBoardError = action.payload.error;
    },

    editBulletinBoardRequest(state) {
      state.editBulletinBoardLoading = true;
      state.editBulletinBoardDone = false;
      state.editBulletinBoardError = null;
    },
    editBulletinBoardSuccess(state) {
      state.editBulletinBoardLoading = false;
      state.editBulletinBoardDone = true;
      state.getBulletinBoardDone = false;
      state.getBulletinBoardDetailDone = false;
      state.bulletinBoards = [];
    },
    editBulletinBoardFailure(state, action) {
      state.editBulletinBoardLoading = false;
      state.editBulletinBoardError = action.payload.error;
    },

    addBulletinBoardCommentsRequest(state) {
      state.addBulletinBoardCommentsLoading = true;
      state.addBulletinBoardCommentsDone = false;
      state.addBulletinBoardCommentsError = null;
    },
    addBulletinBoardCommentsSuccess(state, action) {
      state.addBulletinBoardCommentsLoading = false;
      state.addBulletinBoardCommentsDone = true;
      state.getBulletinBoardDetailLoading = false;
      state.getBulletinBoardDetailDone = false;
    },
    addBulletinBoardCommentsFailure(state, action) {
      state.addBulletinBoardCommentsLoading = false;
      state.addBulletinBoardCommentsError = action.payload.error;
    },

    deleteBulletinBoardCommentsRequest(state) {
      state.deleteBulletinBoardCommentsLoading = true;
      state.deleteBulletinBoardCommentsDone = false;
      state.deleteBulletinBoardCommentsError = null;
    },
    deleteBulletinBoardCommentsSuccess(state, action) {
      const postIndex = state.bulletinBoards.findIndex(
        (v) => v.id === action.payload.pageId
      );
      state.bulletinBoards[postIndex].Comments = state.bulletinBoards[
        postIndex
      ].Comments.filter((v) => v.id !== action.payload.id);
      state.deleteBulletinBoardCommentsLoading = false;
      state.deleteBulletinBoardCommentsDone = true;
    },
    deleteBulletinBoardCommentsFailure(state, action) {
      state.deleteBulletinBoardCommentsLoading = false;
      state.deleteBulletinBoardCommentsError = action.payload.error;
    },

    editBulletinBoardCommentsRequest(state) {
      state.editBulletinBoardCommentsLoading = true;
      state.editBulletinBoardCommentsDone = false;
      state.editBulletinBoardCommentsError = null;
    },
    editBulletinBoardCommentsSuccess(state) {
      const postIndex = state.bulletinBoards.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.bulletinBoards[postIndex].Comments.findIndex(
        (v) => v.id === action.payload.id
      );
      state.bulletinBoards[postIndex].Comments[commentIndex].content =
        action.payload.content;
      state.editBulletinBoardCommentsLoading = false;
      state.editBulletinBoardCommentsDone = true;
    },

    likeBulletinBoardCommentsRequest(state) {
      state.likeBulletinBoardCommentsLoading = true;
      state.likeBulletinBoardCommentsDone = false;
      state.likeBulletinBoardCommentsError = null;
    },
    likeBulletinBoardCommentsSuccess(state, action) {
      const postIndex = state.bulletinBoards.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.bulletinBoards[postIndex].Comments.findIndex(
        (v) => v.id === action.payload.id
      );
      state.bulletinBoards[postIndex].Comments[commentIndex].heart.unshift(
        action.payload.User
      );
      state.likeBulletinBoardCommentsLoading = false;
      state.likeBulletinBoardCommentsDone = true;
    },
    unlikeBulletinBoardCommentsFailure(state, action) {
      state.unlikeBulletinBoardCommentsLoading = false;
      state.unlikeBulletinBoardCommentsError = action.payload.error;
    },

    unlikeBulletinBoardCommentsRequest(state) {
      state.unlikeBulletinBoardCommentsLoading = true;
      state.unlikeBulletinBoardCommentsDone = false;
      state.unlikeBulletinBoardCommentsError = null;
    },
    unlikeBulletinBoardCommentsSuccess(state, action) {
      const postIndex = state.bulletinBoards.findIndex(
        (v) => v.id === action.payload.pageId
      );
      const commentIndex = state.bulletinBoards[postIndex].Comments.findIndex(
        (v) => v.id === action.payload.id
      );
      state.bulletinBoards[postIndex].Comments[commentIndex].heart =
        state.bulletinBoards[postIndex].Comments[commentIndex].heart.filter(
          (v) => v.id !== action.payload.User.id
        );
      state.unlikeBulletinBoardCommentsLoading = false;
      state.unlikeBulletinBoardCommentsDone = true;
    },
    unlikeBulletinBoardCommentsFailure(state, action) {
      state.unlikeBulletinBoardCommentsLoading = false;
      state.unlikeBulletinBoardCommentsError = action.payload.error;
    },

    editBulletinBoardCommentsFailure(state, action) {
      state.editBulletinBoardCommentsLoading = false;
      state.editBulletinBoardCommentsError = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.bulletinBoard,
      };
    });
  },
});

export const bulletinBoardActions = bulletinBoardSlice.actions;
export default bulletinBoardSlice.reducer;
