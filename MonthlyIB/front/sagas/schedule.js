import axios from "axios";
import { all, takeLatest, put, delay, fork } from "redux-saga/effects";
import { scheduleActions } from "../reducers/schedule";
// APIs are placeholder 
function addScheduleAPI(data) {
    return axios.post("/Schedule", data)
}

function* addSchedule(action) {
    try {
        // const result = yield call(addScheduleAPI, action.data)
        yield delay(1000);

        yield put(
            scheduleActions.addScheduleSuccess(action.payload)
        );
    } catch (err) {
        yield put(
            scheduleActions.addScheduleFailure(err.error)
        );
    }
}

function* watchSchedule() {
    yield takeLatest(scheduleActions.addScheduleRequest, addSchedule);
}

export default function* scheduleSaga() {
    yield all([
        fork(watchSchedule),
    ])
}