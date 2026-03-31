"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardUser,
  faCirclePlay,
  faStar,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./CourseDetail.module.css";

import { getCookie } from "@/apis/cookies";
import { coursePostUser } from "@/apis/courseAPI";
import { useCourseStore } from "@/store/course";
import { useUserInfo, useUserStore } from "@/store/user";

const CourseDetailRight = ({
  courseDetail,
  reviewAvgPoint,
  reviewCount,
  pageId,
  categoryPath,
}) => {
  const router = useRouter();
  const accessToken = getCookie("accessToken");
  const { userInfo } = useUserInfo();
  const { deleteCourseItem } = useCourseStore();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();
  const subscribeStatus = userSubscribeInfo?.[0]?.subscribeStatus;
  const isSubscribed = subscribeStatus === "ACTIVE";

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (!savedUser) return;

    const localUser = JSON.parse(savedUser);
    if (localUser?.state?.userInfo?.userId) {
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
    }
  }, [getUserSubscribeInfo]);

  const onClickEdit = useCallback(() => {
    router.push(`/course/write?type=edit&videoLessonsId=${pageId}`);
  }, [pageId, router]);

  const onClickDelete = useCallback(() => {
    deleteCourseItem(pageId, { accessToken });
    router.push("/course");
  }, [accessToken, deleteCourseItem, pageId, router]);

  const onClickTakeCourse = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      if (isSubscribed) {
        const response = await coursePostUser(parseInt(pageId), { accessToken });
        if (response?.status === 200 || response?.status === 201) {
          router.push(`/course/player/${pageId}`);
        }
      }
    } catch (error) {
      console.error("수강 신청 중 오류 발생:", error);
    }
  };

  return (
    <aside className={styles.course_right}>
      <div className={styles.course_info_cont}>
        <div className={styles.course_info_top}>
          <div className={styles.course_info_tit}>
            {categoryPath && (
              <span className={styles.course_info_path}>{categoryPath}</span>
            )}
            <p className={styles.course_tit}>{courseDetail?.title}</p>

            <div className={styles.course_review_cont}>
              <FontAwesomeIcon icon={faStar} />
              <p>
                {reviewAvgPoint.toFixed(1)} <span>{`(${reviewCount})`}</span>
              </p>
            </div>
          </div>

          <div className={styles.course_info_etc}>
            <ul>
              <li className={styles.courseStatCard}>
                <FontAwesomeIcon icon={faCirclePlay} />
                <div>
                  <span className={styles.courseStatLabel}>수강 기간</span>
                  <b className={styles.courseStatValue}>
                    {courseDetail?.duration === ""
                      ? "구독 기간 동안 무제한"
                      : courseDetail?.duration || "상시 수강"}
                  </b>
                </div>
              </li>
              <li className={styles.courseStatCard}>
                <FontAwesomeIcon icon={faVideo} />
                <div>
                  <span className={styles.courseStatLabel}>구성</span>
                  <b className={styles.courseStatValue}>
                    {courseDetail?.chapterInfo || "강의 구성 준비 중"}
                  </b>
                </div>
              </li>
              <li className={styles.courseStatCard}>
                <FontAwesomeIcon icon={faChalkboardUser} />
                <div>
                  <span className={styles.courseStatLabel}>강사</span>
                  <b className={styles.courseStatValue}>
                    {courseDetail?.instructor || "Monthly IB"}
                  </b>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.center_btn_wrap}>
          <button
            type="button"
            onClick={onClickTakeCourse}
            className={`${styles.courseActionButton} ${
              !isSubscribed ? styles.disabled : ""
            }`}
          >
            {isSubscribed ? "수강하기" : "구독 후 수강 가능"}
          </button>
        </div>

        {userInfo?.authority === "ADMIN" && (
          <div className={styles.courseAdminActions}>
            <div className={styles.center_btn_wrap_edit}>
              <button type="button" onClick={onClickEdit}>
                수정하기
              </button>
            </div>
            <div className={styles.center_btn_wrap_delete}>
              <button type="button" onClick={onClickDelete}>
                삭제하기
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CourseDetailRight;
