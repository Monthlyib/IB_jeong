import { all, fork, takeLatest, delay, put, call } from "redux-saga/effects";
import axios from "axios";
import { ibPostActions } from "../reducers/ibpost";
import { token } from "./user";

function addIbPostAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/magazine/list", data[0], {
    headers: { Authorization: data[1], "Content-type": "multipart/form-data" },
  });
}

function* addIbPost(action) {
  try {
    yield call(addIbPostAPI, [action.payload, token]);
    yield put(ibPostActions.addIBPostSuccess());
  } catch (err) {
    console.log(err.response.data);
    yield put(ibPostActions.addIBPostFailure(err.response.data));
  }
}

function deleteIbPostAPI(data) {
  return axios.delete("https://api.hongsh.in/ib/v1/magazine/list", {
    headers: { Authorization: data[1] },
    data: data[0],
  });
}

function* deleteIbPost(action) {
  try {
    yield call(deleteIbPostAPI, [action.payload, token]);
    yield put(ibPostActions.deleteIBPostSuccess());
  } catch (err) {
    console.log(err.response.data);
    yield put(ibPostActions.deleteIBPostFailure(err.response.data));
  }
}

function getIbPostAPI() {
  return axios.get("https://api.hongsh.in/ib/v1/magazine/list");
}

function getIbPdfAPI(data) {
  return axios.get(
    `https://api.hongsh.in/ib/v1/magazine/view?token=${data[1]}&num=${data[0]}`
  );
}

function* getIbPdf(action) {
  try {
    const result = yield call(getIbPostAPI, [action.payload, token]);
    console.log(result);
    yield put(ibPostActions.getIBPdfSuccess());
  } catch (err) {
    yield put(ibPostActions.getIBPdfFailure(err.response.data));
  }
}

function getIbPostImageAPI(data) {
  return axios.get(
    `https://api.hongsh.in/ib/v1/magazine/image?num=${data[0]}`,
    {
      headers: { Authorization: data[1] },
    }
  );
}

function* getIbPost() {
  try {
    const result = yield call(getIbPostAPI);
    const ibData = [...result.data];
    for (let i = 0; i < result.data.length; i++) {
      let image = yield call(getIbPostImageAPI, [result.data[i].num, token]);
      ibData[i] = {
        ...result.data[i],
        Image: { src: image.config.url },
      };
    }
    yield put(ibPostActions.getIBPostSuccess(ibData));
  } catch (err) {
    yield put(ibPostActions.getIBPostFailure(err.response.data));
  }
}
function* watchGetIbPost() {
  yield takeLatest(ibPostActions.getIBPostRequest, getIbPost);
}
function* watchGetIbPdf() {
  yield takeLatest(ibPostActions.getIBPdfRequest, getIbPdf);
}

function* watchDeleteIbPost() {
  yield takeLatest(ibPostActions.deleteIBPostRequest, deleteIbPost);
}

function* watchAddIbPost() {
  yield takeLatest(ibPostActions.addIBPostRequest, addIbPost);
}

export default function* ibPostSaga() {
  yield all([
    fork(watchAddIbPost),
    fork(watchGetIbPost),
    fork(watchDeleteIbPost),
    fork(watchGetIbPdf),
  ]);
}
