import { tokenRequireApi } from "./refreshToken";

const COURSE_API_URL = "api/video";
const COURSE_REPLY_API_URL = "api/video-reply";
const COURSE_CATEGORY_API_URL = "api/video-category";
const COURSE_IMAGE_API_URL = "api/video-image";

export const courseDeleteItem = async (videoLessonsId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(`${COURSE_API_URL}/${videoLessonsId}`, config);
  } catch (error) {
    console.error(error);
  }
};

export const courseDeleteRelpyItem = async (videoLessonsReplyId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${COURSE_REPLY_API_URL}/${videoLessonsReplyId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const courseDeleteCategoryItem = async (videoCategoryId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.delete(
      `${COURSE_CATEGORY_API_URL}/${videoCategoryId}`,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const coursePostItem = async (
  title,
  content,
  instructor,
  chapterInfo,
  duration,
  chapters,
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      title,
      content,
      instructor,
      chapterInfo,
      duration,
      chapters,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
    };
    const res = await tokenRequireApi.post(`${COURSE_API_URL}`, data, config);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const coursePostRelpyItem = async (
  videoLessonsId,
  authorId,
  content,
  star,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      videoLessonsId,
      authorId,
      content,
      star,
    };
    await tokenRequireApi.post(`${COURSE_REPLY_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const courseVoteRelpyItem = async (videoLessonsReplyId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {};
    await tokenRequireApi.post(
      `${COURSE_REPLY_API_URL}/vote/${videoLessonsReplyId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const coursePostThumnail = async (videoLessonsId, image, session) => {
  try {
    const formData = new FormData(); // formData 생성
    formData.append("image", image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: session?.accessToken,
      },
    };
    await tokenRequireApi.post(
      `${COURSE_IMAGE_API_URL}/${videoLessonsId}`,
      formData,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const coursePostCateogry = async (
  videoCategoryStatus,
  categoryName,
  parentsId,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = { videoCategoryStatus, categoryName, parentsId };
    await tokenRequireApi.post(`${COURSE_CATEGORY_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const courseReviseItem = async (
  videoLessonsId,
  title,
  content,
  instructor,
  chapterInfo,
  duration,
  chapters,
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId,
  videoLessonsStatus,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      videoLessonsId,
      title,
      content,
      instructor,
      chapterInfo,
      duration,
      chapters,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      videoLessonsStatus,
    };
    await tokenRequireApi.patch(`${COURSE_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const courseReviseRelpyItem = async (
  videoLessonsId,
  videoLessonsReplyId,
  content,
  star,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      videoLessonsReplyId,
      videoLessonsId,
      content,
      star,
    };
    await tokenRequireApi.patch(`${COURSE_REPLY_API_URL}`, data, config);
  } catch (error) {
    console.error(error);
  }
};

export const courseUserList = async (userId, page, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };

    const res = await tokenRequireApi.get(
      `${COURSE_API_URL}/enrolment/${userId}?page=${page}`,
      config
    );

    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const courseReviseCateogry = async (
  videoCategoryId,
  videoCategoryStatus,
  categoryName,
  parentsId,
  session
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {
      videoCategoryId,
      videoCategoryStatus,
      categoryName,
      parentsId,
    };
    const res = await tokenRequireApi.patch(
      `${COURSE_CATEGORY_API_URL}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};

export const coursePostUser = async (videoLessonsId, session) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessToken,
      },
    };
    const data = {};
    const res = await tokenRequireApi.post(
      `${COURSE_API_URL}/enrolment/${videoLessonsId}`,
      data,
      config
    );
  } catch (error) {
    console.error(error);
  }
};
