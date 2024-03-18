import { all, fork } from "redux-saga/effects";

import userSaga from "./user";
import ibPostSaga from "./ibpost";
import coursePostSaga from "./coursePost";
import newsSaga from "./news";
import guideSaga from "./guide";
import bulletionBoardSaga from "./bulletinboard";
import questionSaga from "./question";
import scheduleSaga from "./schedule";
import reviewSaga from "./review";
import archiveSaga from "./archive";

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(ibPostSaga),
    fork(coursePostSaga),
    fork(newsSaga),
    fork(guideSaga),
    fork(bulletionBoardSaga),
    fork(questionSaga),
    fork(scheduleSaga),
    fork(reviewSaga),
    fork(archiveSaga),
  ]);
}
