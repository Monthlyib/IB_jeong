import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  questionList: [],
  questionDetail: {},
  addQuestionLoading: false,
  addQuestionDone: false,
  addQuestionError: null,

  addQuestionAnswerLoading: false,
  addQuestionAnswerDone: false,
  addQuestionAnswerError: null,

  getQuestionListLoading: false,
  getQuestionListDone: false,
  getQuestionListError: null,

  getQuestionDetailLoading: false,
  getQuestionDetailDone: false,
  getQuestionDetailError: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    addQuestionRequest(state) {
      state.addQuestionLoading = true;
      state.addQuestionDone = false;
      state.addQuestionError = null;
    },
    addQuestionSuccess(state) {
      state.addQuestionLoading = false;
      state.addQuestionDone = true;
      state.getQuestionListDone = false;
      state.questionList = [];
    },
    addQuestionFailure(state, action) {
      state.addQuestionLoading = false;
      state.addQuestionError = action.error;
    },

    getQuestionListRequest(state) {
      state.getQuestionListLoading = true;
      state.getQuestionListDone = false;
      state.getQuestionListError = null;
    },
    getQuestionListSuccess(state, action) {
      state.getQuestionListLoading = false;
      state.getQuestionListDone = true;
      state.questionList = [...action.payload];
    },
    getQuestionListFailure(state, action) {
      state.getQuestionListLoading = false;
      state.getQuestionListError = action.error;
    },

    getQuestionDetailRequest(state) {
      state.getQuestionDetailLoading = true;
      state.getQuestionDetailDone = false;
      state.getQuestionDetailError = null;
    },
    getQuestionDetailSuccess(state, action) {
      state.getQuestionDetailLoading = false;
      state.getQuestionDetailDone = true;
      state.questionDetail = { ...action.payload };
    },
    getQuestionDetailFailure(state, action) {
      state.getQuestionDetailLoading = false;
      state.getQuestionDetailError = action.error;
    },

    addQuestionAnswerRequest(state) {
      state.addQuestionAnswerLoading = true;
      state.addQuestionAnswerDone = false;
      state.addQuestionAnswerError = null;
    },
    addQuestionAnswerSuccess(state, action) {
      state.addQuestionAnswerLoading = false;
      state.addQuestionAnswerDone = true;
    },
    addQuestionAnswerFailure(state, action) {
      state.addQuestionAnswerLoading = false;
      state.addQuestionAnswerError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.question,
      };
    });
  },
});

export const questionActions = questionSlice.actions;
export default questionSlice.reducer;
