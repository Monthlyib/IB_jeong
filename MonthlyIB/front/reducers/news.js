import shortId from "shortid";
import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  news: [
    {
      id: "1",
      title: "타이틀 영역",
      tag: "board",
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고, 모든 감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고,`,
      User: {
        id: "1",
        userName: "admin",
      },
      Date: "2023/09/19",
      View: 0,
      Image: {
        src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg",
      },
      Files: [
        {
          filename: "file1.pdf",
          src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
        {
          filename: "file2.pdf",
          src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
    },
    {
      id: "2",
      title: "타이틀 영역",
      tag: "board",
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고, 모든 감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고,`,
      User: {
        id: "1",
        userName: "admin",
      },
      Date: "2023/09/19",
      View: 0,
      Image: {
        src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg",
      },
      Files: [
        {
          filename: "file1.pdf",
          src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
        {
          filename: "file2.pdf",
          src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
      ],
    },
    {
      id: "3",
      title: "타이틀 영역",
      tag: "board",
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고, 모든 감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고,`,
      User: {
        id: "1",
        userName: "admin",
      },
      Date: "2023/09/19",
      View: 0,
      Image: {
        src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg",
      },
      Files: [],
    },
    {
      id: "4",
      title: "타이틀 영역",
      tag: "board",
      content: `감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고, 모든 감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 
            대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 
            대한민국의 주권은 국민에게 있고,`,
      User: {
        id: "1",
        userName: "admin",
      },
      Date: "2023/09/19",
      View: 0,
      Image: {
        src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg",
      },
      Files: [],
    },
  ],

  addNewsLoading: false,
  addNewsDone: false,
  addNewsError: null,

  deleteNewsLoading: false,
  deleteNewsDone: false,
  deleteNewsError: null,

  editNewsLoading: false,
  editNewsDone: false,
  editNewsError: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    addNewsRequest(state) {
      state.addNewsLoading = true;
      state.addNewsDone = false;
      state.addNewsError = null;
    },
    addNewsSuccess(state, action) {
      state.news.unshift(dummyNews(action.payload));
      state.addNewsLoading = false;
      state.addNewsDone = true;
    },
    addNewsFailure(state, action) {
      state.addNewsLoading = false;
      state.addNewsError = action.error;
    },

    deleteNewsRequest(state) {
      state.deleteNewsLoading = true;
      state.deleteNewsDone = false;
      state.deleteNewsError = null;
    },
    deleteNewsSuccess(state, action) {
      state.news = state.news.filter((v) => v.id !== action.payload.pageId);
      state.deleteNewsLoading = false;
      state.deleteNewsDone = true;
    },
    deleteNewsFailure(state, action) {
      state.deleteNewsLoading = false;
      state.deleteNewsError = action.error;
    },

    editNewsRequest(state) {
      state.editNewsLoading = true;
      state.editNewsDone = false;
      state.editNewsError = null;
    },
    editNewsSuccess(state, action) {
      const postIndex = state.news.findIndex(
        (v) => v.id === action.payload.pageId
      );
      state.news[postIndex].title = action.payload.title;
      state.news[postIndex].content = action.payload.content;
      state.editNewsLoading = false;
      state.editNewsDone = true;
    },
    editNewsFailure(state, action) {
      state.editNewsLoading = false;
      state.editNewsError = action.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.news,
      };
    });
  },
});

const dummyNews = (data) => ({
  id: shortId.generate(),
  tag: "board",
  title: data.title,
  content: data.content,
  User: {
    id: data.User.id,
    userName: data.User.userName,
  },
  Date: "2023/09/19",
  View: 0,
  Image: {
    src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg",
  },
  Files: [],
});

export const newsActions = newsSlice.actions;
export default newsSlice.reducer;
