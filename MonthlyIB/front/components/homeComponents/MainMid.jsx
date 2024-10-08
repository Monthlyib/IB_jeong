"use client";
import styles from "./MainMid.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faAngleRight,
  faBookOpen,
  faNewspaper,
  faCalculator,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MainMid = () => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const onChangeSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
  };
  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      if (searchKeyword !== "") {
        router.push(`/search?keyword=${searchKeyword}`);
      }
    }
  };
  return (
    <>
      <section className={styles.search_wrap}>
        <p>궁금한 키워드를 검색해보세요!</p>
        <div className={styles.search_inner}>
          <Link href={`/search?keyword=${searchKeyword}`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Link>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{
              position: "absolute",
              left: "2.6rem",
              top: "2.2rem",
              fontSize: "2.8rem",
              fontWeight: "bold",
              color: "var(--primary01)",
              zIndex: 2,
            }}
            onClick={() => {
              router.push(`/search?keyword=${searchKeyword}`);
            }}
          />
          <input
            type="text"
            placeholder="궁금한 키워드를 입력해보세요"
            value={searchKeyword}
            onChange={onChangeSearchKeyword}
            onKeyDown={onCheckEnter}
          />
        </div>
      </section>

      <section className={styles.guide_wrap}>
        <h2>IB 입시가이드</h2>
        <ul className={styles.guide_inner} style={{ listStyle: "none" }}>
          <li>
            <Link href="/ib">
              <span>
                월간 IB <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <FontAwesomeIcon icon={faBookOpen} />
            </Link>
          </li>
          <li>
            <Link href="/board">
              <span>
                IB 입시 뉴스 <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <FontAwesomeIcon icon={faNewspaper} />
            </Link>
          </li>
          <li>
            <Link href="/board/calculator">
              <span>
                합격예측 계산기 <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <FontAwesomeIcon icon={faCalculator} />
            </Link>
          </li>
          <li>
            <Link href="/board/download">
              <span>
                자료실 <FontAwesomeIcon icon={faAngleRight} />
              </span>
              <FontAwesomeIcon icon={faClipboard} />
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
};

export default MainMid;
