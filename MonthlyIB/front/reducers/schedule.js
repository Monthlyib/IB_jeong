import shortId from "shortid";
import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  schedules: [
    {
      id: 1,
      subject: "영어",
      status: "예약",
      tag: "schedule",
      content: `영어기초 관련으로 예약할려구요!`,
      User: {
        username: "1",
        name: "홍길동",
      },
      Date: "2023.04.23 03:00",
    },

    {
      id: 2,
      subject: "수학",
      status: "완료",
      tag: "schedule",
      content: `수학기초 관련으로 예약할려구요! 수학기초 관련으로 예약할려구요!
            수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!
            수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!수학기초 관련으로 예약할려구요!
            수학기초 관련으로 예약할려구요!`,
      User: {
        username: "1",
        name: "홍길동",
      },
      Date: "2023.02.12 17:00",
    },
    {
      id: 3,
      subject: "사회",
      status: "예약취소",
      tag: "schedule",
      content: `사회기최 관련으로 예약할려구요! 사회기최 관련으로 예약할려구요!
            사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!
            사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!사회기최 관련으로 예약할려구요!
            사회기최 관련으로 예약할려구요!`,
      User: {
        username: "1",
        name: "홍길동",
      },
      Date: "2022.12.31 03:00",
    },
  ],
  addScheduleLoading: false,
  addScheduleDone: false,
  addScheduleError: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    addScheduleRequest(state) {
      state.addScheduleLoading = true;
      state.addScheduleDone = false;
      state.addScheduleError = null;
    },
    addScheduleSuccess(state, action) {
      state.schedules.unshift(dummySchedule(action.payload));
      state.addScheduleLoading = false;
      state.addScheduleDone = true;
    },
    addScheduleFailure(state, action) {
      state.addScheduleLoading = false;
      state.addScheduleError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.schedule,
      };
    });
  },
});

const dummySchedule = (data) => ({
  id: shortId.generate(),
  state: "예약",
  tag: "schedule",
  content: data.content,
  User: {
    username: data.user.username,
    name: data.user.name,
  },
  Date: "2023.04.23 03:00",
});

export const scheduleActions = scheduleSlice.actions;
export default scheduleSlice.reducer;
