import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  ibposts: [],

  addIBPostLoading: false,
  addIBPostDone: false,
  addIBPostError: null,

  getIBPostLoading: false,
  getIBPostDone: false,
  getIBPostError: null,

  getIBPdfLoading: false,
  getIBPdfDone: false,
  getIBPdfError: null,

  deleteIBPostLoading: false,
  deleteIBPostDone: false,
  deleteIBPostError: null,
};
const ibPostSlice = createSlice({
  name: "ibPost",
  initialState,
  reducers: {
    addIBPostRequest(state) {
      state.addIBPostLoading = true;
      state.addIBPostDone = false;
      state.addIBPostError = null;
    },
    addIBPostSuccess(state) {
      state.addIBPostLoading = false;
      state.addIBPostDone = true;
      state.getIBPostDone = false;
      state.ibposts = [];
    },
    addIBPostFailure(state, action) {
      state.addIBPostLoading = false;
      state.addIBPostError = action.error;
    },

    deleteIBPostRequest(state) {
      state.deleteIBPostLoading = true;
      state.deleteIBPostDone = false;
      state.deleteIBPostError = null;
    },
    deleteIBPostSuccess(state) {
      state.deleteIBPostLoading = false;
      state.deleteIBPostDone = true;
      state.getIBPostDone = false;
      state.ibposts = [];
    },
    deleteIBPostFailure(state, action) {
      state.deleteIBPostLoading = false;
      state.deleteIBPostError = action.error;
    },

    getIBPostRequest(state) {
      state.getIBPostLoading = true;
      state.getIBPostDone = false;
      state.getIBPostError = null;
    },
    getIBPostSuccess(state, action) {
      state.getIBPostLoading = false;
      state.getIBPostDone = true;
      state.ibposts = action.payload;
    },
    getIBPostFailure(state, action) {
      state.getIBPostLoading = false;
      state.getIBPostError = action.error;
    },

    getIBPdfRequest(state) {
      state.getIBPdfLoading = true;
      state.getIBPdfDone = false;
      state.getIBPdfError = null;
    },
    getIBPdfSuccess(state) {
      state.getIBPdfLoading = false;
      state.getIBPdfDone = true;
    },
    getIBPdfFailure(state, action) {
      state.getIBPdfLoading = false;
      state.getIBPdfError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.ibpost,
      };
    });
  },
});

export const ibPostActions = ibPostSlice.actions;
export default ibPostSlice.reducer;
