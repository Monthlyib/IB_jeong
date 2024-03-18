import axios from "axios";
import { all, takeLatest, put, delay, fork } from "redux-saga/effects";
import { reviewActions } from "../reducers/review";
// APIs are placeholder 
function addReviewsAPI(data) {
    return axios.post("/Reviews", data)
}

function* addReviews(action) {
    try {
        // const result = yield call(addReviewAPI, action.data)
        yield delay(1000);

        yield put(
            reviewActions.addReviewsSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            reviewActions.addReviewsFailure(err.error)
        );
    }
}

function* watchReviews() {
    yield takeLatest(reviewActions.addReviewsRequest, addReviews);
}

export default function* reviewSaga() {
    yield all([
        fork(watchReviews),
    ])
}