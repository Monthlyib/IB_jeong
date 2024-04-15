"use client";
// import { useDispatch, useSelector } from "react-redux";
import styles from "../BoardCommon.module.css";
import { useCallback, useEffect, useState } from "react";
import BulletinBoardItems from "./BulletinBoardItems";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
// import { bulletinBoardActions } from "../../../reducers/bulletinboard";
import BoardCommonHead from "../BoardCommonHead";

const BulletinBoardComponents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);

  // const { getBulletinBoardDone } = useSelector((state) => state.bulletinBoard);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (getBulletinBoardDone !== true) {
  //     dispatch(bulletinBoardActions.getBulletinBoardRequest());
  //   }
  // }, [getBulletinBoardDone]);

  // const { bulletinBoards } = useSelector((state) => state.bulletinBoard);
  const [bulletinBoards, setBulletinBoards] = useState([]);
  // const { logInDone } = useSelector((state) => state.user);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChangeSearch = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  // const onClickSearchButton = useCallback(() => {
  //   setSearchedPosts([
  //     ...bulletinBoards.filter((v) => v.title.includes(searchKeyword)),
  //   ]);
  //   setCurrentPage(1);
  //   setSeraching(true);
  // }, [searchKeyword]);

  return (
    <>
      <main className="width_content archive">
        <BoardCommonHead
          searchKeyword={searchKeyword}
          onChangeSearch={onChangeSearch}
          modal={3}
          placeholder="자유게시판 검색"
        />
        {/* {logInDone && (
          <div className={styles.right_btn}>
            <Link
              href="/board/bulletinboard/write"
              className={styles.btn_write}
            >
              <FontAwesomeIcon icon={faPenAlt} />
              <span>글쓰기</span>
            </Link>
          </div>
        )} */}
        <div className={styles.board_wrap}>
          <BulletinBoardItems
            bulletinBoardContents={searching ? searchedPosts : bulletinBoards}
            currentPage={currentPage}
            numShowContents={5}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
};

export default BulletinBoardComponents;
