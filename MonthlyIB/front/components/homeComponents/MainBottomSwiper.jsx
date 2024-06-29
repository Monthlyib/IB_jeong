import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import styles from "./MainBottom.module.css";
import { Navigation } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import shortid from "shortid";

const MainBottomSwiper = ({ posts, type }) => {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      slidesPerView={1.5}
      loop={false}
      navigation={{
        prevEl: ".community_left_btn",
        nextEl: ".community_right_btn",
      }}
      breakpoints={
        type === "video"
          ? {
              //반응형 width
              320: {
                slidesPerView: 1.5, //브라우저가 768보다 클 때
              },
              640: {
                slidesPerView: 1.5, //브라우저가 768보다 클 때
              },
              1024: {
                slidesPerView: 2, //브라우저가 1024보다 클 때
              },
            }
          : {
              //반응형 width
              320: {
                slidesPerView: 1.5, //브라우저가 768보다 클 때
              },
              640: {
                slidesPerView: 2.5, //브라우저가 768보다 클 때
              },
              1024: {
                slidesPerView: 4, //브라우저가 1024보다 클 때
              },
            }
      }
    >
      {posts.map((post) =>
        type === "video" ? (
          <SwiperSlide key={shortid.generate()}>
            <div className={styles.lesson_item}>
              <Link href={`/course/${post.videoLessonsId}`}>
                <div className={styles.lesson_info_wrap}>
                  <figure>
                    {post?.videoLessonsIbThumbnailUrl === "" ? (
                      <Image
                        src={"/img/common/user_profile.jpg"}
                        width="100"
                        height="100"
                        alt="강의 표지 사진"
                      />
                    ) : (
                      <Image
                        src={post?.videoLessonsIbThumbnailUrl}
                        width="100"
                        height="100"
                        alt="강의 표지 사진"
                      />
                    )}
                  </figure>

                  <div className={styles.lesson_txt}>
                    <p className={styles.lesson_tit}>{post.title}</p>
                    <div className={styles.lesson_btn}>
                      <FontAwesomeIcon icon={faPlayCircle} />
                      <span>바로학습</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ) : type === "tutoring" ? (
          <SwiperSlide key={shortid.generate()}>
            <div className={styles.board_item}>
              <Link href="#">
                <span
                  className={
                    post.tutoringStatus === "CONFIRM"
                      ? `${styles.sc_ceiling} ${styles.reserve}`
                      : post.tutoringStatus === "WAIT"
                      ? `${styles.sc_ceiling} ${styles.cancel}`
                      : `${styles.sc_ceiling} ${styles.complete}`
                  }
                >
                  {post.tutoringStatus}
                </span>
                <h4>{post.date}</h4>
                <div className={styles.sc_subject}>
                  <span>{post.detail}</span>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ) : (
          <SwiperSlide key={shortid.generate()}>
            <div className={styles.board_item}>
              <Link href={`/question/${post.questionId}`}>
                <span
                  className={
                    post.questionStatus === "ANSWER_WAIT"
                      ? `${styles.q_ceiling} ${styles.wait}`
                      : `${styles.q_ceiling} ${styles.complete}`
                  }
                >
                  {post.questionStatus === "ANSWER_WAIT"
                    ? "답변대기"
                    : "답변완료"}
                </span>
                <h4 dangerouslySetInnerHTML={{ __html: post.content }}></h4>
                <div className={styles.q_subject}>
                  <span>{post.subject}</span>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        )
      )}
    </Swiper>
  );
};
export default MainBottomSwiper;
