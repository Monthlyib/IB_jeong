import { useCallback, useEffect, useState } from "react";
import styles from "./IbComponents.module.css";
import IbItems from "./IbItems";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ibPostActions } from "../../reducers/ibpost";

const IbComponents = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [formModal, setFormModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSeraching] = useState(false);

  const { User, logInDone } = useSelector((state) => state.user);
  const { getIBPostDone, ibposts } = useSelector((state) => state.ibpost);
  const [windowSize, setWindowSize] = useState(0);
  const [searchedPosts, setSearchedPosts] = useState([]);

  useEffect(() => {
    if (getIBPostDone === false) {
      dispatch(ibPostActions.getIBPostRequest());
    }
  }, [getIBPostDone]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);
  const onClickSearchButton = useCallback(() => {
    setSearchedPosts([
      ...ibposts.filter((v) => v.title.includes(searchKeyword)),
    ]);
    setCurrentPage(1);
    setSeraching(true);
  }, [searchKeyword]);
  const onClickOpenModal = useCallback(() => {
    setFormModal((prevState) => !prevState);
    console.log(formModal);
  }, [formModal]);

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
              value={searchKeyword}
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

        {User.role === 100 && (
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
              IBContents={searching ? searchedPosts : ibposts}
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
