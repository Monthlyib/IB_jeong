import { tokenRequireApi } from "./refreshToken";

const BOARD_API_URL = "api/board";

export const boardDeleteItem = async (boardId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${BOARD_API_URL}/${boardId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyDeleteItem = async (boardReplyId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${BOARD_API_URL}/reply/${boardReplyId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

// need to test

export const boardReviseItem = async (boardId, title, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content };
    await tokenRequireApi.patch(`${BOARD_API_URL}/${boardId}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyReviseItem = async (boardReplyId, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { content };
    await tokenRequireApi.patch(
      `${BOARD_API_URL}/reply/${boardReplyId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const boardPost = async (title, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { title, content };
    await tokenRequireApi.post(`${BOARD_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyPost = async (boardId, content, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { content };
    await tokenRequireApi.post(
      `${BOARD_API_URL}/reply/${boardId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const boardReplyVote = async (boardReplyId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {};
    await tokenRequireApi.post(
      `${BOARD_API_URL}/reply-vote/${boardReplyId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const boardFilePost = async (boardId, file, session) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken,
      },
    };
    const res = await tokenRequireApi.post(
      `${BOARD_API_URL}/board-file/${boardId}`,
      formData,
      config
    );
  } catch (error) {
    console.error(error);
  }
};
