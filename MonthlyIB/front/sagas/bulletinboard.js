import axios from "axios";
import { all, takeLatest, put, delay, fork, call } from "redux-saga/effects";
import { bulletinBoardActions } from "../reducers/bulletinboard";
import { token } from "./user";

function getBulletinBoardAPI() {
  return axios.get("https://api.hongsh.in/ib/v1/board/post?board=2");
}

function* getBulletinBoard(action) {
  try {
    const result = yield call(getBulletinBoardAPI);
    yield put(bulletinBoardActions.getBulletinBoardSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(bulletinBoardActions.getBulletinBoardFailure(err.response.data));
  }
}

function* watchGetBulletinBoard() {
  yield takeLatest(
    bulletinBoardActions.getBulletinBoardRequest,
    getBulletinBoard
  );
}

function getBulletinBoardDetailAPI(data) {
  return axios.get(
    `https://api.hongsh.in/ib/v1/board/post?num=${data[0].pageId}`,
    {
      headers: { Authorization: data[1] },
    }
  );
}

function* getBulletinBoardDetail(action) {
  try {
    const result = yield call(getBulletinBoardDetailAPI, [
      action.payload,
      token,
    ]);
    yield put(bulletinBoardActions.getBulletinBoardDetailSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(
      bulletinBoardActions.getBulletinBoardDetailFailure(err.response.error)
    );
  }
}

function* watchGetBulletinBoardDeatail() {
  yield takeLatest(
    bulletinBoardActions.getBulletinBoardDetailRequest,
    getBulletinBoardDetail
  );
}

function addBulletinBoardAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/board/post", data[0], {
    headers: { Authorization: data[1] },
  });
}
function* addBulletinBoard(action) {
  try {
    yield call(addBulletinBoardAPI, [action.payload, token]);
    yield put(bulletinBoardActions.addBulletinBoardSuccess());
  } catch (err) {
    console.log(err.response);
    yield put(bulletinBoardActions.addBulletinBoardFailure(err.response.error));
  }
}

function* watchAddBulletinBoard() {
  yield takeLatest(
    bulletinBoardActions.addBulletinBoardRequest,
    addBulletinBoard
  );
}

function deleteBulletinBoardAPI(data) {
  return axios.delete("https://api.hongsh.in/ib/v1/board/post", {
    headers: { Authorization: data[1] },
    data: data[0],
  });
}

function* deleteBulletinBoard(action) {
  try {
    console.log(action.payload);
    yield call(deleteBulletinBoardAPI, [action.payload, token]);
    yield put(bulletinBoardActions.deleteBulletinBoardSuccess());
  } catch (err) {
    console.log(err.response);
    yield put(
      bulletinBoardActions.deleteBulletinBoardFailure(err.response.data)
    );
  }
}

function* watchDeleteBulletinBoard() {
  yield takeLatest(
    bulletinBoardActions.deleteBulletinBoardRequest,
    deleteBulletinBoard
  );
}

function editBulletinBoardAPI(data) {
  console.log(data);
  return axios.patch("https://api.hongsh.in/ib/v1/board/post", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* editBulletinBoard(action) {
  try {
    console.log(action.payload);
    yield call(editBulletinBoardAPI, [action.payload, token]);
    yield put(bulletinBoardActions.editBulletinBoardSuccess());
  } catch (err) {
    console.log(err.response);
    yield put(bulletinBoardActions.editBulletinBoardFailure(err.response.data));
  }
}

function* watchEditBulletinBoard() {
  yield takeLatest(
    bulletinBoardActions.editBulletinBoardRequest,
    editBulletinBoard
  );
}

function addBulletinBoardCommentsAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/board/post", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* addBulletinBoardComments(action) {
  try {
    yield call(addBulletinBoardCommentsAPI, [action.payload, token]);
    yield put(bulletinBoardActions.addBulletinBoardCommentsSuccess());
  } catch (err) {
    yield put(
      bulletinBoardActions.addBulletinBoardCommentsFailure(err.response.data)
    );
  }
}

function* watchBulletinBoardComments() {
  yield takeLatest(
    bulletinBoardActions.addBulletinBoardCommentsRequest,
    addBulletinBoardComments
  );
}

function deleteBulletinBoardCommentsAPI(data) {
  return axios.post("/bulletionboardComments", data);
}

function* deleteBulletinBoardComments(action) {
  try {
    //const result = yield call(deleteBulletinBoardAPI, action.data);
    yield delay(1000);
    yield put(
      bulletinBoardActions.deleteBulletinBoardCommentsSuccess(action.payload)
    );
  } catch (err) {
    yield put(
      bulletinBoardActions.deleteBulletinBoardCommentsFailure(err.response.data)
    );
  }
}

function* watchDeleteBulletinBoardComments() {
  yield takeLatest(
    bulletinBoardActions.deleteBulletinBoardCommentsRequest,
    deleteBulletinBoardComments
  );
}

function editBulletinBoardCommentsAPI(data) {
  return axios.post("/bulletionboardComments", data);
}

function* editBulletinBoardComments(action) {
  try {
    //const result = yield call(editBulletinBoardAPI, action.data);
    yield delay(1000);
    yield put(
      bulletinBoardActions.editBulletinBoardCommentsSuccess(action.payload)
    );
  } catch (err) {
    yield put(
      bulletinBoardActions.editBulletinBoardCommentsFailure(err.response.data)
    );
  }
}

function* watchEditBulletinBoardComments() {
  yield takeLatest(
    bulletinBoardActions.editBulletinBoardCommentsRequest,
    editBulletinBoardComments
  );
}

function likeBulletinBoardCommentsAPI(data) {
  return axios.post("/bulletionboardComments", data);
}

function* likeBulletinBoardComments(action) {
  try {
    //const result = yield call(likeBulletinBoardAPI, action.data);
    yield delay(1000);
    yield put(
      bulletinBoardActions.likeBulletinBoardCommentsSuccess(action.payload)
    );
  } catch (err) {
    yield put(
      bulletinBoardActions.likeBulletinBoardCommentsFailure(err.response.data)
    );
  }
}

function* watchLikeBulletinBoardComments() {
  yield takeLatest(
    bulletinBoardActions.likeBulletinBoardCommentsRequest,
    likeBulletinBoardComments
  );
}

function unlikeBulletinBoardCommentsAPI(data) {
  return axios.post("/bulletionboardComments", data);
}

function* unlikeBulletinBoardComments(action) {
  try {
    //const result = yield call(unlikeBulletinBoardAPI, action.data);
    yield delay(1000);
    yield put(
      bulletinBoardActions.unlikeBulletinBoardCommentsSuccess(action.payload)
    );
  } catch (err) {
    yield put(
      bulletinBoardActions.unlikeBulletinBoardCommentsFailure(err.response.data)
    );
  }
}

function* watchUnlikeBulletinBoardComments() {
  yield takeLatest(
    bulletinBoardActions.unlikeBulletinBoardCommentsRequest,
    unlikeBulletinBoardComments
  );
}

export default function* bulletionBoardSaga() {
  yield all([
    fork(watchGetBulletinBoardDeatail),
    fork(watchGetBulletinBoard),
    fork(watchAddBulletinBoard),
    fork(watchBulletinBoardComments),
    fork(watchDeleteBulletinBoard),
    fork(watchEditBulletinBoard),
    fork(watchDeleteBulletinBoardComments),
    fork(watchEditBulletinBoard),
    fork(watchEditBulletinBoardComments),
    fork(watchLikeBulletinBoardComments),
    fork(watchUnlikeBulletinBoardComments),
  ]);
}
