import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  archiveList: [],
  downloadURL: "",

  getArchiveListLoading: false,
  getArchiveListDone: false,
  getArchiveListError: null,

  downloadArchiveLoading: false,
  downloadArchiveDone: false,
  downloadArchiveError: null,

  uploadArchiveLoading: false,
  uploadArchiveDone: false,
  uploadArchiveError: null,

  deleteArchiveLoading: false,
  deleteArchiveDone: false,
  deleteArchiveError: null,
};

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    getArchiveListRequest(state) {
      state.getArchiveListLoading = true;
      state.getArchiveListDone = false;
      state.getArchiveListError = null;
    },
    getArchiveListSuccess(state, action) {
      state.archiveList.unshift(...action.payload);
      state.getArchiveListLoading = false;
      state.getArchiveListDone = true;
    },
    getArchiveListFailure(state, action) {
      state.getArchiveListLoading = false;
      state.getArchiveListError = action.payload.error;
    },

    downloadArchiveRequest(state) {
      state.downloadArchiveLoading = true;
      state.downloadArchiveDone = false;
      state.downloadArchiveError = null;
    },
    downloadArchiveSuccess(state, action) {
      state.downloadArchiveLoading = false;
      state.downloadArchiveDone = true;
      state.downloadURL = action.payload.url;
    },
    downloadArchiveFailure(state, action) {
      state.downloadArchiveLoading = false;
      state.downloadArchiveError = action.payload.error;
    },

    uploadArchiveRequest(state) {
      state.uploadArchiveLoading = true;
      state.uploadArchiveDone = false;
      state.uploadArchiveError = null;
    },
    uploadArchiveSuccess(state) {
      state.uploadArchiveLoading = false;
      state.uploadArchiveDone = true;
      state.getArchiveListDone = false;
      state.archiveList = [];
    },
    uploadArchiveFailure(state, action) {
      state.uploadArchiveLoading = false;
      state.uploadArchiveError = action.payload.error;
    },

    deleteArchiveRequest(state) {
      state.deleteArchiveLoading = true;
      state.deleteArchiveDone = false;
      state.deleteArchiveError = null;
    },
    deleteArchiveSuccess(state) {
      state.deleteArchiveLoading = false;
      state.deleteArchiveDone = true;
      state.getArchiveListDone = false;
      state.archiveList = [];
    },
    deleteArchiveFailure(state, action) {
      state.deleteArchiveLoading = false;
      state.deleteArchiveError = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.archiveList,
      };
    });
  },
});

export const archiveActions = archiveSlice.actions;
export default archiveSlice.reducer;
