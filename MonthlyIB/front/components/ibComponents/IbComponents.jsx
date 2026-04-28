"use client";
import { useEffect, useState } from "react";
import styles from "./IbComponents.module.css";
import IbItems from "./IbItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPenAlt } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";

import { useIBStore } from "@/store/ib";
import { useUserInfo } from "@/store/user";

const IbComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { ibPosts, ibPageInfo, loading, error, getIBList } = useIBStore();

  const { userInfo } = useUserInfo();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchKeyword(searchInput.trim());
  };

  useEffect(() => {
    getIBList(currentPage, searchKeyword);
  }, [currentPage, searchKeyword, getIBList]);

  return (
    <main className={styles.ibPage}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>MONTHLY IB ARCHIVE</span>
          <h1>월간 IB</h1>
          <p>
            IB 학습 전략, 입시 인사이트, 에세이 가이드를 한곳에 모아 읽는 Monthly IB 아카이브입니다.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <form className={styles.searchForm} onSubmit={onSubmitSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="제목 또는 본문으로 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>

          <div className={styles.heroMeta}>
            <span>{ibPageInfo?.totalElements || 0}개의 글</span>
            <span>{searchKeyword ? `"${searchKeyword}" 검색 결과` : "최신순 정렬"}</span>
          </div>

          {userInfo?.authority === "ADMIN" && (
            <Link href="/ibwrite" className={styles.btnWrite}>
              <FontAwesomeIcon icon={faPenAlt} />
              <span>새 글쓰기</span>
            </Link>
          )}
        </div>
      </section>

      <IbItems
        IBContents={ibPosts}
        currentPage={currentPage}
        pageInfo={ibPageInfo}
        loading={loading}
        error={error}
        searchKeyword={searchKeyword}
        onPageChange={handlePageChange}
      />
    </main>
  );
};

export default IbComponents;
