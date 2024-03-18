import axios from "axios";
import { all, takeLatest, put, delay, fork, call } from "redux-saga/effects";
import { archiveActions } from "../reducers/archive";
import { token } from "./user";

function getArchiveListAPI(token) {
  return axios.get("https://api.hongsh.in/ib/v1/file/list", {
    headers: { Authorization: token },
  });
}

function* getArchiveList() {
  try {
    const result = yield call(getArchiveListAPI, token);
    yield put(archiveActions.getArchiveListSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(archiveActions.getArchiveListFailure(err.response.data));
  }
}

function* watchGetArchiveList() {
  yield takeLatest(archiveActions.getArchiveListRequest, getArchiveList);
}

function downloadArchiveAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/file/download?key=${data[0]}`, {
    headers: { Authorization: data[1] },
  });
}

function* downloadArchive(action) {
  try {
    const result = yield call(downloadArchiveAPI, [action.payload.key, token]);
    yield put(archiveActions.downloadArchiveSuccess(result.data));
  } catch (err) {
    console.log(err.response);
    yield put(archiveActions.downloadArchiveFailure(err.response.data));
  }
}

function* watchDownloadArchive() {
  yield takeLatest(archiveActions.downloadArchiveRequest, downloadArchive);
}

function getUploadURLAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/file/upload?key=${data[0]}`, {
    headers: { Authorization: data[1] },
  });
}

function uploadArchiveAPI(data) {
  console.log(data);
  return axios.put(data[0], data[1], {
    headers: { "Content-type": "multipart/form-data" },
  });
}

function* uploadArchive(action) {
  try {
    const URL = yield call(getUploadURLAPI, [
      action.payload.currentPath,
      token,
    ]);
    console.log(URL.data);
    const result = yield call(uploadArchiveAPI, [
      URL.data.url,
      action.payload.file,
      token,
    ]);
    console.log(result);
    yield put(archiveActions.uploadArchiveSuccess(result.data));
  } catch (err) {
    console.log(err.response.data);
    yield put(archiveActions.uploadArchiveFailure(err.response.data));
  }
}

function* watchUploadArchive() {
  yield takeLatest(archiveActions.uploadArchiveRequest, uploadArchive);
}

function deleteArchiveAPI(data) {
  return axios.delete(
    `https://api.hongsh.in/ib/v1/file/delete?key=${data[0]}`,
    {
      headers: { Authorization: data[1] },
    }
  );
}

function* deleteArchive(action) {
  try {
    yield call(deleteArchiveAPI, [action.payload.currentPath, token]);

    yield put(archiveActions.deleteArchiveSuccess());
  } catch (err) {
    console.log(err.response.data);
    yield put(archiveActions.deleteArchiveFailure(err.response.data));
  }
}

function* watchDeleteArchive() {
  yield takeLatest(archiveActions.deleteArchiveRequest, deleteArchive);
}

export default function* archiveSaga() {
  yield all([
    fork(watchGetArchiveList),
    fork(watchDownloadArchive),
    fork(watchUploadArchive),
    fork(watchDeleteArchive),
  ]);
}
