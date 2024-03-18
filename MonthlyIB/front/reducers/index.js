import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import userSlice from "./user";
import reviewSlice from "./review";
import scheduleSlice from "./schedule";
import questionSlice from "./question";
import newsSlice from "./news";
import ibPostSlice from "./ibpost";
import coursePostSlice from "./coursePost";
import bulletinBoardSlice from "./bulletinboard";
import archiveSlice from "./archive";

const combinedReducer = combineReducers({
  user: userSlice,
  ibpost: ibPostSlice,
  review: reviewSlice,
  schedule: scheduleSlice,
  question: questionSlice,
  news: newsSlice,
  coursePost: coursePostSlice,
  bulletinBoard: bulletinBoardSlice,
  archive: archiveSlice,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    console.log(action);
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export default reducer;
