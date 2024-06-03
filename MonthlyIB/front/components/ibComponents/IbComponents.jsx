"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./IbComponents.module.css";
import IbItems from "./IbItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";

import { useIBStore } from "@/store/ib";
import { useUserStore } from "@/store/user";

const IbComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formModal, setFormModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);
  const { ibPosts, getIBList } = useIBStore();
  const [windowSize, setWindowSize] = useState(0);
  const [searchedPosts, setSearchedPosts] = useState([]);

  const { userInfo } = useUserStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  const onClickOpenModal = useCallback(() => {
    setFormModal((prevState) => !prevState);
  }, [formModal]);

  useEffect(() => {
    getIBList(currentPage);
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    } else {
      return () =>
        window.removeEventListener("resize", () => {
          return null;
        });
    }
  }, []);

  return (
    <>
      <main className="width_content archive">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Monthly IB</span>
            <h2>월간 IB</h2>
          </div>

          <div className="ft_search">
            <input
              type="text"
              placeholder="월간IB 검색"
              value={searchKeyword}
              onChange={onChange}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     onClickSearchButton();
              //   }
              // }}
            />
            <button
            // onClick={onClickSearchButton}
            >
              검색
            </button>
          </div>
        </div>

        {userInfo?.authority === "ADMIN" && (
          <div className={styles.right_btn}>
            <Link href="/ibwrite" className={styles.btn_write}>
              <FontAwesomeIcon icon={faPenAlt} />
              <span>글쓰기</span>
            </Link>
          </div>
        )}

        <div className={styles.ib_archive_wrap}>
          <div className={styles.ib_archive_cont}>
            <IbItems
              IBContents={searching ? searchedPosts : ibPosts}
              currentPage={currentPage}
              numShowContents={windowSize > 640 ? 6 : 4}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default IbComponents;
