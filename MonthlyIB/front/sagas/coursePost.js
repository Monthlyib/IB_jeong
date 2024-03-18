import { all, put, takeLatest, delay, fork, call } from "redux-saga/effects";
import axios from "axios";
import { coursePostActions } from "../reducers/coursePost";
import { token } from "./user";
function addCoursePostAPI(data) {
  return axios.post("https://api.hongsh.in/ib/v1/course/list", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* addCoursePost(action) {
  try {
    yield call(addCoursePostAPI, [action.payload, token]);

    yield put(coursePostActions.addCoursePostSuccess());
  } catch (err) {
    yield put(coursePostActions.addCoursePostFailure(err.response.data));
  }
}

function* watchAddCoursePost() {
  yield takeLatest(coursePostActions.addCoursePostRequest, addCoursePost);
}

function editCoursePostAPI(data) {
  return axios.put("https://api.hongsh.in/ib/v1/course/list", data[0], {
    headers: { Authorization: data[1] },
  });
}

function* editCoursePost(action) {
  try {
    yield call(editCoursePostAPI, [action.payload, token]);
    yield put(coursePostActions.editCoursePostSuccess());
  } catch (err) {
    yield put(coursePostActions.editCoursePostFailure(err.response.data));
  }
}

function* watchEditCoursePost() {
  yield takeLatest(coursePostActions.editCoursePostRequest, editCoursePost);
}

function deleteCoursePostAPI(data) {
  return axios.delete("https://api.hongsh.in/ib/v1/course/list", {
    headers: { Authorization: data[1] },
    data: data[0],
  });
}

function* deleteCoursePost(action) {
  try {
    yield call(deleteCoursePostAPI, [action.payload, token]);
    yield put(coursePostActions.deleteCoursePostSuccess());
  } catch (err) {
    yield put(coursePostActions.deleteCoursePostFailure(err.response.data));
  }
}

function* watchDeleteCoursePost() {
  yield takeLatest(coursePostActions.deleteCoursePostRequest, deleteCoursePost);
}

// APIs are placeholder
function getCoursePostAPI() {
  return axios.get("https://api.hongsh.in/ib/v1/course/list");
}

function getCourseImageAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/course/image?num=${data}`);
}

function* getCoursePost() {
  try {
    const result = yield call(getCoursePostAPI);
    let image = yield call(getCourseImageAPI, result.data[0].num);
    const courseData = [...result.data];
    for (let i = 0; i < Object.entries(courseData).length; i++) {
      let image = yield call(getCourseImageAPI, result.data[i].num);
      courseData[i] = {
        ...result.data[i],
        Image: { src: image.config.url },
      };
    }

    yield put(coursePostActions.getCoursePostSuccess(courseData));
  } catch (err) {
    console.log(err.response.data);
    yield put(coursePostActions.getCoursePostFailure(err.response.data));
  }
}

function getCourseDetailAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/course/list?num=${data}`);
}

function* getCourseDetail(action) {
  try {
    const result = yield call(getCourseDetailAPI, action.payload.num);
    const image = yield call(getCourseImageAPI, result.data.num);
    const courseDetail = { ...result.data, Image: { src: image.config.url } };

    yield put(coursePostActions.getCourseDetailSuccess(courseDetail));
  } catch (err) {
    console.log(err.response.data);
    yield put(coursePostActions.getCourseDetailFailure(err.response.data));
  }
}

function getCourseVideolAPI(data) {
  return axios.get(`https://api.hongsh.in/ib/v1/course/video?num=${data}`);
}

function* getCourseVideo(action) {
  try {
    // const result = yield call(getCourseVideolAPI, action.payload.num);
    const testVid = [
      {
        video:
          "//cdn-cf-east.streamable.com/video/mp4/soji4_2.mp4?Expires=1702472640&Signature=PwxrEIRXaMFd8A4FuVnm3sbiYW-nsbC8gskSEO4BgJC7b8cHTB10L7VuysOlQRNz0mTqy7Dv2Jwgqsc5ay2FLne6d1wZ5bxFPw4l6HXpLTQV-iK67fGFk58SFbFIFXHCgYiKOSs4Assxffyj7eYqWROTR4W7pBnjLl0nDc1h-zb3oN0Am4DOsdlqt4GDhwuS4muIbyr1oxcn09eF8LK8ZDqU1n456K7yASTwa-9S3kCM46c6lmzvr10h4kINuQLQWp2qCkBE4t4qeJDxOAp~X4qzhdlxaGsWq8JiS0eyh3C-U8-zhf7m0F~lrQqe-4zSCY54MI~WzmTiVhNJ9HltVQ__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ",
        title: "Rick rolled",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\r\n",
      },
      {
        video: "https://streamable.com/e/soji4",
        title: "Rick Rolled 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
      },
    ];

    yield put(coursePostActions.getCourseVideoSuccess(testVid));
  } catch (err) {
    console.log(err.response.data);
    yield put(coursePostActions.getCourseVideoFailure(err.response.data));
  }
}

function* watchGetCourseDetail() {
  yield takeLatest(coursePostActions.getCourseDetailRequest, getCourseDetail);
}

function* watchGetCourseVideo() {
  yield takeLatest(coursePostActions.getCourseVideoRequest, getCourseVideo);
}

function* watchGetCourse() {
  yield takeLatest(coursePostActions.getCoursePostRequest, getCoursePost);
}

// APIs are placeholder
function addCourseReviewAPI(data) {
  return axios.post("/api/coursereview", data);
}

function* addCourseReview(action) {
  try {
    //const result = yield call(addCourseReviewAPI, action.data)
    yield delay(1000);
    yield put(coursePostActions.addCourseReviewSuccess(action.payload));
  } catch (err) {
    yield put(coursePostActions.addCourseReviewFailure(err));
  }
}

function* watchCourseReview() {
  yield takeLatest(coursePostActions.addCourseReviewRequest, addCourseReview);
}

// APIs are placeholder
function deleteCourseReviewAPI(data) {
  return axios.post("/api/coursereview", data);
}

function* deleteCourseReview(action) {
  try {
    //const result = yield call(deleteCourseReviewAPI, action.data)
    yield delay(1000);
    yield put(coursePostActions.deleteCourseReviewSuccess(action.payload));
  } catch (err) {
    yield put(coursePostActions.deleteCourseReviewFailure(err.response.data));
  }
}

function* watchDeleteCourseReview() {
  yield takeLatest(
    coursePostActions.deleteCourseReviewRequest,
    deleteCourseReview
  );
}

// APIs are placeholder
function editCourseReviewAPI(data) {
  return axios.post("/api/coursereview", data);
}

function* editCourseReview(action) {
  try {
    //const result = yield call(editCourseReviewAPI, action.data)
    yield delay(1000);
    yield put(coursePostActions.editCourseReviewSuccess(action.payload));
  } catch (err) {
    yield put(coursePostActions.editCourseReviewFailure(err.response.data));
  }
}

function* watchEditCourseReview() {
  yield takeLatest(coursePostActions.editCourseReviewRequest, editCourseReview);
}

function likeCourseReviewAPI(data) {
  return axios.post("/api/coursereview", data);
}

function* likeCourseReview(action) {
  try {
    //const result = yield call(likeCourseReviewAPI, action.data)
    yield delay(1000);
    yield put(coursePostActions.likeCourseReviewSuccess(action.payload));
  } catch (err) {
    yield put(coursePostActions.likeCourseReviewFailure(err.response.data));
  }
}

function* watchLikeCourseReview() {
  yield takeLatest(coursePostActions.likeCourseReviewRequest, likeCourseReview);
}

function unlikeCourseReviewAPI(data) {
  return axios.post("/api/coursereview", data);
}

function* unlikeCourseReview(action) {
  try {
    //const result = yield call(unlikeCourseReviewAPI, action.data)
    yield delay(1000);
    yield put(coursePostActions.unlikeCourseReviewSuccess(action.payload));
  } catch (err) {
    yield put(coursePostActions.unlikeCourseReviewFailure(err.response.data));
  }
}

function* watchUnlikeCourseReview() {
  yield takeLatest(
    coursePostActions.unlikeCourseReviewRequest,
    unlikeCourseReview
  );
}

export default function* coursePostSaga() {
  yield all([
    fork(watchAddCoursePost),
    fork(watchCourseReview),
    fork(watchDeleteCourseReview),
    fork(watchEditCourseReview),
    fork(watchLikeCourseReview),
    fork(watchUnlikeCourseReview),
    fork(watchGetCourse),
    fork(watchGetCourseDetail),
    fork(watchGetCourseVideo),
    fork(watchEditCoursePost),
    fork(watchDeleteCoursePost),
  ]);
}
