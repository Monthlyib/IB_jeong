import axios from "axios";
import { all, takeLatest, fork, delay, put } from "redux-saga/effects";

import { guideActions } from "../reducers/guide";

// APIs are placeholder

function addGuideAPI(data) {
    return axios.post("/guide", data)
}

function* addGuide(action) {
    try {
        // const result = yield call(addGuideAPI, action.data);
        yield delay(1000);
        yield put(
            guideActions.addGuideSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            guideActions.addGuideFailure(err.response.error)
        );
    }
};

function* watchGuide() {
    yield takeLatest(guideActions.addGuideRequest, addGuide);
}

export default function* guideSaga() {
    yield all([
        fork(watchGuide),
    ])
}