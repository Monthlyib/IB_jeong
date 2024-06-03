"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import styles from "./Main.module.css";
import { useMemo } from "react";
import { Navigation } from "swiper";

const MainSwiper = () => {
  const style = useMemo(() => {
    return {
      width: "26rem",
      height: "286px",
      background: "#51346C",
      borderRadius: "1rem",
      overflow: "hidden",
      zIndex: "-2",
    };
  }, []);
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      slidesPerView={1.5}
      loop={false}
      navigation={{
        prevEl: ".top_left_btn",
        nextEl: ".top_right_btn",
      }}
      breakpoints={{
        //반응형 width
        320: {
          slidesPerView: 1.5, //브라우저가 768보다 클 때
        },
        640: {
          slidesPerView: 2.5, //브라우저가 768보다 클 때
        },
        1024: {
          slidesPerView: 2.5, //브라우저가 1024보다 클 때
        },
      }}
    >
      <SwiperSlide style={style}>
        <Link href="/course" className={styles.pr_wrap}>
          <div className={styles.pr_top}>LESSON</div>
          <div className={styles.pr_md}>L</div>
          <div className={styles.pr_bt}>영상강의</div>
          <div className={styles.pr_dim}></div>
        </Link>
      </SwiperSlide>
      <SwiperSlide style={style}>
        <Link href="/board/download" className={styles.pr_wrap}>
          <div className={styles.pr_top}>STUDY</div>
          <div className={styles.pr_md}>S</div>
          <div className={styles.pr_bt}>Study Material</div>
          <div className={styles.pr_dim}></div>
        </Link>
      </SwiperSlide>
      <SwiperSlide style={style}>
        <Link href="/tutoring" className={styles.pr_wrap}>
          <div className={styles.pr_top}>TUTORING</div>
          <div className={styles.pr_md}>T</div>
          <div className={styles.pr_bt}>튜터링 예약</div>
          <div className={styles.pr_dim}></div>
        </Link>
      </SwiperSlide>
    </Swiper>
  );
};

export default MainSwiper;
