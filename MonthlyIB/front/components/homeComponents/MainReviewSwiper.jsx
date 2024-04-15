import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

import styles from "./MainBottom.module.css";
import { Navigation } from "swiper";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regStar } from "@fortawesome/free-regular-svg-icons";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

const MainReviewSwiper = ({ posts }) => {
  const starRendering = (star) => {
    const stars = [];
    for (let i = 0; i < star; i++) {
      stars.push(
        <span key={`fill_stars_${i}`}>
          <FontAwesomeIcon icon={faStar} className={styles.fill_stars} />
        </span>
      );
    }

    for (let i = 0; i < 5 - star; i++) {
      stars.push(
        <span key={`empty_stars_${i}`}>
          <FontAwesomeIcon icon={regStar} className={styles.empty_stars} />
        </span>
      );
    }

    return stars;
  };
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      slidesPerView={1.5}
      loop={false}
      navigation={{
        prevEl: ".left_btn",
        nextEl: ".right_btn",
      }}
      breakpoints={{
        //반응형 width
        320: {
          slidesPerView: 1.2, //브라우저가 768보다 클 때
        },
        640: {
          slidesPerView: 1.5, //브라우저가 768보다 클 때
        },
        1024: {
          slidesPerView: 3, //브라우저가 1024보다 클 때
        },
      }}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id} style={{ padding: "2.5px" }}>
          <div className={styles.board_item}>
            <Link href="#">
              <div className={styles.review_stars}>
                {starRendering(post.star)}
              </div>
              <p>{post.content}</p>
              <div className={styles.review_user}>
                <figure>
                  <Image
                    src={"../../public/img/common/user_profile.jpg"}
                    alt="user profile img"
                  />
                </figure>

                <div className={styles.review_user_nm}>
                  <span>{post.userName}</span>
                </div>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MainReviewSwiper;
