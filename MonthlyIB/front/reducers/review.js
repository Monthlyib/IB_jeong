import shortId from "shortid";
import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  reviews: [
    {
      tag: "review",
      id: 1,
      star: 4,
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수
            있다.
            대한민국의 주권은 국민에게 있고, 모든 대한민국의 주권은 국민에게 있고, 모든`,
      userName: "김명준",
    },
    {
      tag: "review",
      id: 2,
      star: 3,
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수
            있다.
            대한민국의 주권은 국민에게 있고, 모든 대한민국의 주권은 국민에게 있고, 모든`,
      userName: "홍길동",
    },
    {
      tag: "review",
      id: 3,
      star: 5,
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수
            있다.
            대한민국의 주권은 국민에게 있고, 모든 대한민국의 주권은 국민에게 있고, 모든`,
      userName: "홍길동",
    },
    {
      tag: "review",
      id: 4,
      star: 4,
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수
            있다.
            대한민국의 주권은 국민에게 있고, 모든 대한민국의 주권은 국민에게 있고, 모든`,
      userName: "김명준",
    },
  ],
  addReviewsLoading: false,
  addReviewsDone: false,
  addReviewsError: null,
};
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    addReviewsRequest(state) {
      state.addReviewsLoading = true;
      state.addReviewsDone = false;
      state.addReviewsError = null;
    },
    addReviewsSuccess(state, action) {
      state.reviews.unshift(dummyReviews(action.payload));
      state.addReviewsLoading = false;
      state.addReviewsDone = true;
    },
    addReviewsFailure(state, action) {
      state.addReviewsLoading = false;
      state.addReviewsError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.review,
      };
    });
  },
});

const dummyReviews = (data) => ({
  id: shortId.generate(),
  tag: "review",
  star: data.star,
  content: data.content,
  userName: data.userName,
});

export const reviewActions = reviewSlice.actions;
export default reviewSlice.reducer;
