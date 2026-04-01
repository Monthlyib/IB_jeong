"use client";

import styles from "../MainMid.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MainSearchSection = ({
  title = "궁금한 키워드를 검색해보세요!",
  previewMode = false,
}) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  const submitKeyword = () => {
    if (previewMode || searchKeyword.trim() === "") {
      return;
    }
    router.push(`/search?keyword=${searchKeyword}`);
  };

  return (
    <section className={styles.search_wrap}>
      <p>{title}</p>
      <div className={styles.search_inner}>
        <button
          type="button"
          onClick={submitKeyword}
          aria-label="검색"
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            width: "7.2rem",
            height: "100%",
            zIndex: 3,
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <input
          type="text"
          placeholder="궁금한 키워드를 입력해보세요"
          value={searchKeyword}
          disabled={previewMode}
          onChange={(event) => setSearchKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitKeyword();
            }
          }}
        />
      </div>
    </section>
  );
};

export default MainSearchSection;
