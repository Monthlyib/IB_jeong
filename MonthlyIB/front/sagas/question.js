import axios from "axios";
import { all, takeLatest, put, delay, fork, call } from "redux-saga/effects";
import { questionActions } from "../reducers/question";
import { token } from "./user";
// APIs are placeholder
function addQuestionAPI(token) {
  return axios.post("https://api.hongsh.in/ib/v1/qna/list", {
    headers: { Authorization: token },
  });
}
function addQuestionAnswerAPI(data) {
  return axios.post("/QuestionComment", data);
}

function getQuestionListAPI(token) {
  return axios.get("https://api.hongsh.in/ib/v1/qna/list", {
    headers: { Authorization: token },
  });
}

function* getQuestionList() {
  try {
    const result = yield call(getQuestionListAPI, token);
    yield put(questionActions.getQuestionListSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(questionActions.getQuestionListFailure(err.response.data));
  }
}

function getQuestionDetailAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/qna/list?num=${data[0]}`, {
    headers: { Authorization: data[1] },
  });
}

function* getQuestionDetail(action) {
  try {
    const result = yield call(getQuestionDetailAPI, [
      action.payload.num,
      token,
    ]);
    yield put(questionActions.getQuestionDetailSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(questionActions.getQuestionDetailFailure(err.response.data));
  }
}

function* watchGetQuestionDetail() {
  yield takeLatest(questionActions.getQuestionDetailRequest, getQuestionDetail);
}

function* watchGetQuestionList() {
  yield takeLatest(questionActions.getQuestionListRequest, getQuestionList);
}

function* addQuestion() {
  try {
    yield call(addQuestionAPI, token);
    yield put(questionActions.addQuestionSuccess());
  } catch (err) {
    yield put(questionActions.addQuestionFailure(err.response.data));
  }
}

function* watchQuestion() {
  yield takeLatest(questionActions.addQuestionRequest, addQuestion);
}

function* addQuestionAnswer(action) {
  try {
    // const result = yield call(addQuestionAnswerAPI, action.data)
    yield delay(1000);

    yield put(questionActions.addQuestionAnswerSuccess(action.payload));
  } catch (err) {
    yield put(questionActions.addQuestionAnswerFailure(err.error));
  }
}

function* watchQuestionAnswer() {
  yield takeLatest(questionActions.addQuestionAnswerRequest, addQuestionAnswer);
}

export default function* questionSaga() {
  yield all([
    fork(watchQuestion),
    fork(watchQuestionAnswer),
    fork(watchGetQuestionList),
    fork(watchGetQuestionDetail),
  ]);
}
