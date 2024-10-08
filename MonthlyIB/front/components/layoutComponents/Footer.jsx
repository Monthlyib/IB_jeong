"use client";
import Link from "next/link";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathName = usePathname();
  const id = pathName.split("/")[pathName.split("/").length - 1];
  return (
    <>
      {pathName !== `/course/player/${id}` && (
        <footer>
          <div className={styles.ft_header}>
            <Link href="#">이용약관</Link>
            <Link href="#">개인정보처리방침</Link>
          </div>
          <div className={styles.ft_bottom}>
            대표자명 : 김가령
            <br />
            통신판매 번호 : 제2021-서울강남-06731
            <br />
            (주)아고란 | 사업자등록번호 : 815-81-02369
            <br />
            주소 : 서울시 강남구 강남대로 84길 8, 우인빌딩 3층, 4층, 6층 | TEL :
            02-2039-9241, 010-3945-3331
            <br />
            <br />
            에듀아고라학원 제13600호 학교교과교습학원(종합: 국제화-외국어,
            예능-미술)
            <br />
            Yeoksam-dong-3,4,6F, 8, Gangnam-daero 84-gil,, 8, Gangnam-daero
            84-gil, Gangnam-gu, Seoul, Republic of Korea
          </div>{" "}
        </footer>
      )}
    </>
  );
};

export default Footer;
