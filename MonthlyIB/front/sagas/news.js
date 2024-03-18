import axios from "axios";
import { all, takeLatest, put, delay, fork } from "redux-saga/effects";
import { newsActions } from "../reducers/news";

// APIs are placeholder 
function addNewsAPI(data) {
    return axios.post("/news", data)
}

function* addNews(action) {
    try {
        // const result = yield call(addNewsAPI, action.data)
        yield delay(1000);

        yield put(
            newsActions.addNewsSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            newsActions.addNewsFailure(err.error)
        );
    }
}

function* watchNews() {
    yield takeLatest(newsActions.addNewsRequest, addNews);
}

// APIs are placeholder 
function deleteNewsAPI(data) {
    return axios.post("/news", data)
}

function* deleteNews(action) {
    try {
        // const result = yield call(deleteNewsAPI, action.data)
        yield delay(1000);

        yield put(
            newsActions.deleteNewsSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            newsActions.deleteNewsFailure(err.error)
        );
    }
}

function* watchDeleteNews() {
    yield takeLatest(newsActions.deleteNewsRequest, deleteNews);
}

// APIs are placeholder 
function editNewsAPI(data) {
    return axios.post("/news", data)
}

function* editNews(action) {
    try {
        // const result = yield call(editNewsAPI, action.data)
        yield delay(1000);

        yield put(
            newsActions.editNewsSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            newsActions.editNewsFailure(err.error)
        );
    }
}

function* watchEditNews() {
    yield takeLatest(newsActions.editNewsRequest, editNews);
}


export default function* newsSaga() {
    yield all([
        fork(watchNews),
        fork(watchEditNews),
        fork(watchDeleteNews),
    ])
}