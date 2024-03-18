import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  logInLoading: false, // LOG IN
  logInDone: false,
  logInError: null,

  logOutLoading: false, // LOG OUT
  logOutDone: false,
  logOutError: null,

  signUpLoading: false, // SIGN UP
  signUpDone: false,
  signUpError: null,

  editInfoLoading: false, // Edit
  editInfoDone: false,
  editInfoError: null,

  loadInfoLoading: false, // Load info
  loadInfoDone: false,
  loadInfoError: null,

  duplicationCheckLoading: false, // 중복 체크
  duplicationCheckDone: false,
  duplicationCheckError: null,
  duplicationCheckStatus: null,

  imageUpdateLoading: false, // 이미지 수정
  imageUpdateDone: false,
  imageUpdateError: null,

  getPaymentInfoLoading: false, // 결제카드 정보 가져오기
  getPaymentInfoDone: false,
  getPaymentInfoError: null,

  addPaymentInfoLoading: false, // 결제카드 추가하기
  addPaymentInfoDone: false,
  addPaymentInfoError: null,

  deletePaymentInfoLoading: false, // 결제카드 삭제하기
  deletePaymentInfoDone: false,
  deletePaymentInfoError: null,

  subscribePlanLoading: false, // 구독하기
  subscribePlanDone: false,
  subscribePlanError: null,

  addCardLoading: false, // 카드추가
  addCardDone: false,
  addCardError: null,

  User: {
    name: null,
    token: null,
    password: null,
    email: null,
    username: null,
    plan: null,
    start_date: null,
    term: null,
    courses: [], // coursePost에 있는 id 모음
    qnas: [],
    tutors: [],
    posts: [],
    Image: {
      src: null,
    },
    dob: null,
    school: null,
    grade: null,
    country: null,
    address: null,
    consent_marketing: false,
    customerKey: null,
    role: null,
  },

  cardInfo: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInRequest(state) {
      state.logInLoading = true;
      state.logInDone = false;
      state.logInError = null;
    },
    logInSuccess(state, action) {
      state.logInLoading = false;
      state.logInDone = true;
      state.User = action.payload;
    },
    logInFailure(state, action) {
      state.logInLoading = false;
      state.logInError = action.payload;
    },

    loadInfoRequest(state) {
      state.loadInfoLoading = true;
      state.loadInfoDone = false;
      state.loadInfoError = null;
    },
    loadInfoSuccess(state, action) {
      state.loadInfoLoading = false;
      state.loadInfoDone = true;
      if (state.logInDone === false) {
        state.logInDone = true;
      }
      console.log(action.payload);
      state.User = { ...state.User, ...action.payload };
    },
    loadInfoFailure(state, action) {
      state.loadInfoLoading = false;
      state.loadInfoError = action.error;
    },

    addCardRequest(state) {
      state.addCardLoading = true;
      state.addCardDone = false;
      state.addCardError = null;
    },
    addCardSuccess(state, action) {
      state.addCardLoading = false;
      state.addCardDone = true;
      state.cardInfo = [...action.payload, ...state.cardInfo];
    },
    addCardFailure(state, action) {
      state.addCardLoading = false;
      state.addCardError = action.error;
    },

    logOutRequest(state) {
      state.logOutLoading = true;
      state.logOutDone = false;
      state.logOutError = null;
    },
    logOutSuccess(state) {
      state.logInDone = false;
      state.logOutLoading = false;
      state.logOutDone = true;
      state.User = {
        name: null,
        password: null,
        email: null,
        username: null,
        plan: null,
        start_date: null,
        term: null,
        CourseList: [], // coursePost에 있는 id 모음
        NumQuestions: 0,
        NumTutoring: 0,
        Image: {
          src: null,
        },
        dob: null,
        school: null,
        grade: null,
        country: null,
        address: null,
        consent_marketing: false,
      };
    },
    logOutFailure(state, action) {
      state.logOutLoading = false;
      state.logOutError = action.error;
    },
    signUpRequest(state) {
      state.signUpLoading = true;
      state.signUpDone = false;
      state.signUpError = null;
    },
    signUpSuccess(state, action) {
      state.signUpLoading = false;
      state.signUpDone = true;
      state.User = action.payload;
    },
    signUpFailure(state, action) {
      state.signUpLoading = false;
      state.signUpError = action.error;
    },

    imageUpdateRequest(state) {
      state.imageUpdateLoading = true;
      state.imageUpdateDone = false;
      state.imageUpdateError = null;
    },
    imageUpdateSuccess(state) {
      state.imageUpdateLoading = false;
      state.imageUpdateDone = true;
    },
    imageUpdateFailure(state, action) {
      state.imageUpdateLoading = false;
      state.imageUpdateError = action.error;
    },

    getPaymentInfoRequest(state) {
      state.getPaymentInfoLoading = true;
      state.getPaymentInfoDone = false;
      state.getPaymentInfoError = null;
    },
    getPaymentInfoSuccess(state, action) {
      state.getPaymentInfoLoading = false;
      state.getPaymentInfoDone = true;
      state.cardInfo = { ...action.payload };
    },
    getPaymentInfoFailure(state, action) {
      state.getPaymentInfoLoading = false;
      state.getPaymentInfoError = action.error;
    },

    addPaymentInfoRequest(state) {
      state.addPaymentInfoLoading = true;
      state.addPaymentInfoDone = false;
      state.addPaymentInfoError = null;
    },
    addPaymentInfoSuccess(state, action) {
      state.addPaymentInfoLoading = false;
      state.addPaymentInfoDone = true;
      state.cardInfo = { ...state.cardInfo, ...action.payload };
    },
    addPaymentInfoFailure(state, action) {
      state.addPaymentInfoLoading = false;
      state.addPaymentInfoError = action.error;
    },

    subscribePlanRequest(state) {
      state.subscribePlanLoading = true;
      state.subscribePlanDone = false;
      state.subscribePlanError = null;
    },
    subscribePlanSuccess(state) {
      state.subscribePlanLoading = false;
      state.subscribePlanDone = true;
    },
    subscribePlanFailure(state, action) {
      state.subscribePlanLoading = false;
      state.subscribePlanError = action.error;
    },

    editInfoRequest(state) {
      state.editInfoLoading = true;
      state.editInfoDone = false;
      state.editInfoError = null;
    },
    editInfoSuccess(state, action) {
      state.editInfoLoading = false;
      state.editInfoDone = true;
      const updatedInfo = action.payload;
      state.User = { ...state.User, ...updatedInfo };
    },
    editInfoFailure(state, action) {
      state.editInfoLoading = false;
      state.editInfoError = action.error;
    },

    duplicationCheckRequest(state) {
      state.duplicationCheckLoading = true;
      state.duplicationCheckDone = false;
      state.duplicationCheckError = null;
    },
    duplicationCheckSuccess(state) {
      state.duplicationCheckLoading = false;
      state.duplicationCheckDone = true;
      state.duplicationCheckStatus = true;
    },
    duplicationCheckFailure(state, action) {
      state.duplicationCheckLoading = false;
      state.duplicationCheckStatus = false;
      state.duplicationCheckError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.user,
      };
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
