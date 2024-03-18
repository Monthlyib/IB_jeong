import { all, fork, put, takeLatest, delay, call } from "redux-saga/effects";
import axios from "axios";
import { userActions } from "../reducers/user";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export let token = cookies.get("token") === "" ? "" : cookies.get("token");
// APIs are placeholder
function logInAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/user/login", data);
}

function checkDuplicationAPI(id) {
  return axios.get(`https://api.hongsh.in/ib/v1/user/register?id=${id}`);
}

function getUserInfoAPI(token) {
  return axios.get("https://api.hongsh.in/ib/v1/user/me", {
    headers: { Authorization: token },
  });
}

function getUserMypageInfoAPI(token) {
  return axios.get("https://api.hongsh.in/ib/v1/user/mypage", {
    headers: { Authorization: token },
  });
}

function getUserImageAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/user/image?num=${data[0]}`, {
    headers: { Authorization: data[1] },
  });
}

function getPlanInfo(token) {
  return axios.get("https://api.hongsh.in/ib/v1/user/plan", {
    headers: { Authorization: token },
  });
}

function* getUserInfo() {
  try {
    console.log("get called");
    const result = yield call(getUserInfoAPI, token);
    console.log(result);
    const userImage = yield call(getUserImageAPI, [result.data.num, token]);
    // const plan = yield call(getPlanInfo, token);
    // console.log(plan);
    const userData = {
      ...result.data,
      courses: [],
      qnas: [],
      tutors: [],
      token: token,
      plan: {
        startDate: 1698593720,
        term: 604800,
        autoRenew: false,
        plan: {
          num: 1,
          name: "BASIC",
          qaClassAssigns: 6,
          videoClasses: 1,
          qas: 5,
          tutorAssigns: 6,
          testBank: false,
        },
      },
      Image: { src: userImage.config.url },
    };

    yield put(userActions.loadInfoSuccess(userData));
  } catch (err) {
    console.log("error... ");
    console.log(err.response.data);
    yield put(userActions.loadInfoFailure(err.response.data));
  }
}

function* checkDuplication(action) {
  try {
    const result = yield call(
      checkDuplicationAPI,
      Object.values(action.payload)
    );
    console.log(result);
    yield put(userActions.duplicationCheckSuccess());
  } catch (err) {
    console.log("error... ");
    console.log(err.response.data);
    yield put(userActions.duplicationCheckFailure(err.response.data));
  }
}

function logOutAPI(data) {
  return axios.post("/logout");
}

function* logIn(action) {
  try {
    console.log(action.payload);
    const result = yield call(logInAPI, action.payload);
    token = result.data.token;
    cookies.set("token", token);
    const userInfo = yield call(getUserInfoAPI, token);
    const userImage = yield call(getUserImageAPI, [userInfo.data.num, token]);
    const mypageInfo = yield call(getUserMypageInfoAPI, token);
    const userData = {
      ...userInfo.data,
      courses: [],
      qnas: [],
      tutors: [],
      token: token,
      plan: {
        startDate: 1698593720,
        term: 604800,
        autoRenew: false,
        plan: {
          num: 1,
          name: "BASIC",
          qaClassAssigns: 6,
          videoClasses: 1,
          qas: 5,
          tutorAssigns: 6,
          testBank: false,
        },
      },
      Image: { src: userImage.config.url },
    };

    userData.courses = [...mypageInfo.data.courses];
    userData.qnas = [...mypageInfo.data.qnas];
    userData.tutors = [...mypageInfo.data.tutors];

    // const plan = yield call(getPlanInfo, token);
    // console.log(plan);

    yield put(userActions.logInSuccess(userData));
  } catch (err) {
    console.log("error... ");
    console.log(err);

    yield put(userActions.logInFailure(err.response.data));
  }
}

function* logOut() {
  try {
    //const result = yield call(logOutAPI)
    cookies.remove("token");
    yield delay(1000);

    yield put(userActions.logOutSuccess());
  } catch (err) {
    console.log("error... ");
    console.log(err.response.data);
    yield put(userActions.logOutFailure(err.response.data));
  }
}

function signUpAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/user/register", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.payload);
    yield put(userActions.signUpSuccess(result.data));
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.signUpFailure(err.response.data));
  }
}

function editInfoAPI(data) {
  return axios.patch("https://api.hongsh.in/ib/v1/user/me", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* editInfo(action) {
  try {
    yield call(editInfoAPI, [action.payload, token]);
    const userInfo = yield call(getUserInfoAPI, { token });
    yield put(userActions.editInfoSuccess(userInfo.data));
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.editInfoFailure(err.response.data));
  }
}

function imageUpdateAPI(data) {
  console.log(data[0]);
  return axios.post("https://api.hongsh.in/ib/v1/user/image", data[0], {
    headers: { Authorization: data[1], "Content-type": "multipart/form-data" },
  });
}

function* imageUpdate(action) {
  try {
    yield call(imageUpdateAPI, [action.payload.file, token]);
    yield put(userActions.imageUpdateSuccess());
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.imageUpdateFailure(err.response.data));
  }
}

function addCardAPI(data) {
  console.log(data);
  return axios.post("https://api.hongsh.in/ib/v1/user/toss", data.authKey, {
    headers: { Authorization: data.token },
  });
}

function* addCard(action) {
  try {
    const result = yield call(addCardAPI, action.payload);
    yield put(userActions.addCardSuccess(result.data));
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.addCardFailure(err.response.data));
  }
}

function getPaymentInfoAPI(token) {
  return axios.get("https://api.hongsh.in/ib/v1/user/toss", {
    headers: { Authorization: token },
  });
}

function* getPaymentInfo() {
  try {
    const result = yield call(getPaymentInfoAPI, [token]);
    const test = [
      {
        num: 1,
        number: "53275011****123*",
        company: "토스뱅크",
        date: 1701321649,
      },
    ];
    // yield put(userActions.getPaymentInfoSuccess(result.data[0]));
    yield put(userActions.getPaymentInfoSuccess(test));
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.getPaymentInfoFailure(err.response.data));
  }
}

function subscribePlanAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/user/plan", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* subscribePlan(action) {
  try {
    yield call(subscribePlanAPI, [action.payload, token]);
    yield put(userActions.subscribePlanSuccess());
  } catch (err) {
    console.log(err.response.data);
    yield put(userActions.subscribePlanFailure(err.response.data));
  }
}

function* watchLoadInfo() {
  yield takeLatest(userActions.loadInfoRequest, getUserInfo);
}

function* watchGetPaymentInfo() {
  yield takeLatest(userActions.getPaymentInfoRequest, getPaymentInfo);
}

function* watchAddCard() {
  yield takeLatest(userActions.addCardRequest, addCard);
}

function* watchSubscribePlan() {
  yield takeLatest(userActions.subscribePlanRequest, subscribePlan);
}

function* watchImageUpdate() {
  yield takeLatest(userActions.imageUpdateRequest, imageUpdate);
}

function* watchCheckDuplication() {
  yield takeLatest(userActions.duplicationCheckRequest, checkDuplication);
}

function* watchLogIn() {
  yield takeLatest(userActions.logInRequest, logIn);
}

function* watchLogOut() {
  yield takeLatest(userActions.logOutRequest, logOut);
}

function* watchSignUp() {
  yield takeLatest(userActions.signUpRequest, signUp);
}
function* watchEditInfo() {
  yield takeLatest(userActions.editInfoRequest, editInfo);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadInfo),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchEditInfo),
    fork(watchCheckDuplication),
    fork(watchImageUpdate),
    fork(watchGetPaymentInfo),
    fork(watchSubscribePlan),
    fork(watchAddCard),
  ]);
}
