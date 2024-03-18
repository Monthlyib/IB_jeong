import shortId from "shortid";
import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";


export const initialState = {
    guidePosts: [
        {
            id: 1,
            content: `관리자단에서 작성한 내용이 노출되는 영역입니다. TEST입니다. 
            관리자단에서 작성한 내용이 노출되는 영역...TEST입니다.`,
            title: '수험가이드 01',
            Image: {
                src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img01.jpg"
            },
            User: {
                id: 0,
                userName: "운영자",
            },
            Date: "2023/09/18",
            View: 0,
        },

        {
            id: 2,
            content: `관리자단에서 작성한 내용이 노출되는 영역입니다. TEST입니다. 
            관리자단에서 작성한 내용이 노출되는 영역...TEST입니다.`,
            title: '수험가이드 02',
            Image: {
                src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg"
            },
            User: {
                id: 0,
                userName: "운영자",
            },
            Date: "2023/09/18",
            View: 0,
        },

        {
            id: 3,
            content: `관리자단에서 작성한 내용이 노출되는 영역입니다. TEST입니다. 
            관리자단에서 작성한 내용이 노출되는 영역...TEST입니다.`,
            title: '수험가이드 03',
            Image: {
                src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img03.jpg"
            },
            User: {
                id: 0,
                userName: "운영자",
            },
            Date: "2023/09/18",
            View: 0,
        },

        {
            id: 4,
            content: `관리자단에서 작성한 내용이 노출되는 영역입니다. TEST입니다. 
            관리자단에서 작성한 내용이 노출되는 영역...TEST입니다.`,
            title: '수험가이드 04',
            Image: {
                id: 0,
                src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img01.jpg"
            },
            User: {
                userName: "운영자",
            },
            Date: "2023/09/18",
            View: 0,
        },

        {
            id: 5,
            content: `관리자단에서 작성한 내용이 노출되는 영역입니다. TEST입니다. 
            관리자단에서 작성한 내용이 노출되는 영역...TEST입니다.`,
            title: '수험가이드 05',
            Image: {
                src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg"
            },
            User: {
                id: 0,
                userName: "운영자",
            },
            Date: "2023/09/18",
            View: 0,
        },
    ],
    addGuideLoading: false,
    addGuideDone: false,
    addGuideError: null,
}

const guideSlice = createSlice({
    name: "guide",
    initialState,
    reducers: {
        addGuideRequest(state) {
            state.addGuideLoading = true;
            state.addGuideDone = false;
            state.addGuideError = null;
        },
        addGuideSuccess(state, action) {
            state.guidePosts.unshift(dummyGuide(action.payload));
            state.addGuideLoading = true;
            state.addGuideDone = false;
        },
        addGuideFailure(state, action) {
            state.addGuideLoading = false;
            state.addGuideError = action.payload.error;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.uder,
            }
        })
    },
})

const dummyGuide = (data) => ({
    id: shortId.generate(),
    content: data.content,
    title: data.title,
    Image: {
        src: "https://raw.githubusercontent.com/wkdgnsgo/image_placeholder/main/img02.jpg"
    },
    User: {
        id: data.user.id,
        userName: data.user.userName,
    },
})

export const guideActions = guideSlice.actions;
export default guideSlice.reducer;