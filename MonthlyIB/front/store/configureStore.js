import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducers";
import rootSaga from "../sagas";

const sagaMiddelware = createSagaMiddleware();

const makeStore = () => {
  const store = configureStore({
    devTools: true,
    reducer,
    middleware: [sagaMiddelware],
  });
  store.sagaTask = sagaMiddelware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});

export default wrapper;
