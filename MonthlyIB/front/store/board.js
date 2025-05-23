import {
  boardGetUserList,
  boardPost,
  boardReplyDeleteItem,
  boardReplyPost,
  boardReplyReviseItem,
  boardReplyVote,
  boardReviseItem,
  boardDeleteItem,
} from "@/apis/boardAPI";
import { boardGetItem, boardGetList } from "@/apis/openAPI";
import { create } from "zustand";

export const useBoardStore = create((set, get) => ({
  loading: false,
  success: false,
  error: null,
  bulletinBoardDetail: {},
  boardList: [],
  PageInfo: {},
  getBoardList: async (currentPage, keyword) => {
    try {
      const res = await boardGetList(currentPage - 1, keyword);
      set({ boardList: res.data, loading: false, success: true, PageInfo: res.pageInfo });
    } catch (error) {
      console.error(error);
    }
  },

  getBoardUserList: async (currentPage, keyword, session) => {
    try {
      const res = await boardGetUserList(currentPage - 1, keyword, session);
      set({ boardList: res.data, loading: false, success: true, PageInfo: res.pageInfo });
    } catch (error) {
      console.error(error);
    }
  },

  getBoardDetail: async (pageId, replyPage) => {
    set({ loading: true, success: false });
    try {
      const res = await boardGetItem(pageId, replyPage - 1);
      set({ bulletinBoardDetail: res.data, loading: false, success: true });
      return res.data;
    } catch (error) {
      console.log(error);
      set({ error, loading: false, success: false });
    }
  },
  setBoardComment: async (pageId, content, session) => {
    set({ loading: true, success: false });
    try {
      await boardReplyPost(pageId, content, session);
      get().getBoardDetail(pageId, 1);
    } catch (error) {
      console.error(error);
      set({ error, loading: false, success: false });
    }
  },

  deleteBoardDetail: async (boardId, session) => {
    set({loading: true, success: false});
    try {
      await boardDeleteItem(boardId, session);
      get().getBoardList(1, "");
      set({loading: false, success: true});
    } catch (error) {
      console.error(error);
      set({ error, loading: false, success: false });
    }
  },

  deleteBoardComment: async (boardReplyId, session, pageId, currentPage) => {
    try {
      await boardReplyDeleteItem(boardReplyId, session);
      get().getBoardDetail(pageId, currentPage);
    } catch (error) {
      console.error(error);
      set({ error, loading: false, success: false });
    }
  },
  reviseBoardComment: async (
    boardReplyId,
    content,
    session,
    pageId,
    currentPage
  ) => {
    try {
      await boardReplyReviseItem(boardReplyId, content, session);
      get().getBoardDetail(pageId, currentPage);
    } catch (error) {
      console.error(error);
      set({ error });
    }
  },
  voteReply: async (pageId, currentPage, boardReplyId, session) => {
    try {
      await boardReplyVote(boardReplyId, session);
      get().getBoardDetail(pageId, currentPage);
    } catch (error) {
      console.error(error);
    }
  },
  postBoard: async (title, content, userInfo) => {
    try {
      await boardPost(title, content, userInfo);
      get().getBoardList(1, "");
    } catch (error) {
      console.error(error);
    }
  },

  reviseBoard: async (boardId, title, content, userInfo) => {
    try {
      await boardReviseItem(boardId, title, content, userInfo);
      get().getBoardList(1, "");
    } catch (error) {
      console.error(error);
    }
  },
  updateBoardComment: (res) => {
    set({ bulletinBoardDetail: res });
  },
}));
