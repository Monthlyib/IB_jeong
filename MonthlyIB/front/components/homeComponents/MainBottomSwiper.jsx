import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import styles from "./MainBottom.module.css";
import { Navigation } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

const MainBottomSwiper = ({ posts }) => {
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
        posts[1].tag === "board"
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
        post.tag === "board" ? (
          <SwiperSlide key={post.id}>
            <div className={styles.lesson_item}>
              <Link href={`/course/${post.id}`}>
                <div className={styles.lesson_info_wrap}>
                  <figure>
                    <img src={post.Image.src} alt="강의 이미지" />
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
        ) : post.tag === "schedule" ? (
          <SwiperSlide key={post.id}>
            <div className={styles.board_item}>
              <Link href="#">
                <span
                  className={
                    post.status === "예약"
                      ? `${styles.sc_ceiling} ${styles.reserve}`
                      : post.status === "예약취소"
                      ? `${styles.sc_ceiling} ${styles.cancel}`
                      : `${styles.sc_ceiling} ${styles.complete}`
                  }
                >
                  {post.status}
                </span>
                <h4>{post.Date}</h4>
                <div className={styles.sc_subject}>
                  <span>{post.subject}</span>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ) : (
          <SwiperSlide key={post.id}>
            <div className={styles.board_item}>
              <Link href={`/question/${post.id}`}>
                <span
                  className={
                    post.status === "답변대기"
                      ? `${styles.q_ceiling} ${styles.wait}`
                      : `${styles.q_ceiling} ${styles.complete}`
                  }
                >
                  {post.status}
                </span>
                <h4>{post.content}</h4>
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
