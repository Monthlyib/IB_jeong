"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./IbComponents.module.css";
import IbItems from "./IbItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";

import { useIBStore } from "@/store/ib";
import { useUserInfo } from "@/store/user";

const IbComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { ibPosts, getIBList } = useIBStore();
  const [windowSize, setWindowSize] = useState(0);

  const searchKeyword = useRef();
  const [searching, setSeraching] = useState(false);

  const { userInfo } = useUserInfo();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = (e) => {
    searchKeyword.current = e.target.value;
  };
  const onClickSearchButton = () => {
    setSeraching((prev) => !prev);
  };

  useEffect(() => {
    const search =
      searchKeyword.current === undefined ? "" : searchKeyword.current;
    getIBList(currentPage, search);
  }, [searching]);

  useEffect(() => {
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
              defaultValue={searchKeyword.current}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickSearchButton();
                }
              }}
            />
            <button onClick={onClickSearchButton}>검색</button>
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
              IBContents={ibPosts}
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
