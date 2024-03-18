import styles from "../styles/search.module.css";
import AppLayout from "../main_components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import BulletinBoardItems from "../page_components/board/bulletinboard/BulletinBoardItems";
import CourseItems from "../page_components/course/CourseItems";
import IbItems from "../page_components/ib/IbItems";
import NewsItems from "../page_components/board/news/NewsItems";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Link from "next/link";

const Search = () => {
    const router = useRouter()
    const { keyword } = router.query;

    if (!keyword) {
        return null;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");

    const { coursePosts } = useSelector((state) => state.coursePost);
    const { bulletinBoard } = useSelector((state) => state.bulletinboard);
    const { mainPosts } = useSelector((state) => state.ibpost);
    const { news } = useSelector((state) => state.news)

    const searchedCoursePosts = coursePosts.filter((v) => v.title.includes(keyword));
    const searchedBulletinBorad = bulletinBoard.filter((v) => v.title.includes(keyword));
    const searchedMainPosts = mainPosts.filter((v) => v.title.includes(keyword));
    const searchedNews = news.filter((v) => v.title.includes(keyword));

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const onChangeSearchKeyword = useCallback((e) => {
        setSearchKeyword(e.target.value)
    }, [])
    const onCheckEnter = useCallback((e) => {
        if (e.key === 'Enter') {
            if (searchKeyword !== "") {
                router.push({
                    pathname: "/search",
                    query: { keyword: searchKeyword, type: "all", }
                }, "/search");
            }
        }
    }, [])
    return (
        <>
            <AppLayout>
                <main className="width_content search">
                    <div className={styles.header_flex}>
                        <div className={styles.header_tit_wrap}>
                            <h2>검색결과</h2>
                            <span>검색하신 <b id="title">{`[ ${keyword} ]`}</b> 결과는 총 <b id="total">
                                {searchedCoursePosts.length + searchedBulletinBorad.length + searchedMainPosts.length + searchedNews.length}
                            </b>개 입니다</span>
                        </div>

                        <div className="ft_search">
                            <input type="text" placeholder="검색" value={searchKeyword} onChange={onChangeSearchKeyword} onKeyDown={onCheckEnter} />
                            <Link href=
                                {{
                                    pathname: '/search/',
                                    query: {
                                        keyword: JSON.stringify(searchKeyword),
                                    }
                                }}
                                as={'/search/'}><button>검색</button></Link>
                        </div>
                    </div>
                    <div className="search_box_wrap">
                        {
                            searchedCoursePosts.length > 0 &&
                            <div className={styles.category_wrap}>
                                <h3>강의</h3>
                                <div className="course_wrap">
                                    <div className="course_cont">
                                        <CourseItems
                                            courseContents={searchedCoursePosts}
                                            currentPage={currentPage}
                                            numShowContents={5}
                                            onPageChange={handlePageChange} />
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            searchedMainPosts.length > 0 &&
                            <div className={styles.category_wrap}>
                                <h3>월간 IB</h3>
                                <div className="course_wrap">
                                    <div className="course_cont">
                                        <div className={styles.ib_archive_wrap}>
                                            <div className={styles.ib_archive_cont}>
                                                <IbItems
                                                    IBContents={searchedMainPosts}
                                                    currentPage={currentPage}
                                                    numShowContents={6}
                                                    onPageChange={handlePageChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            searchedNews.length > 0 &&
                            <div className={styles.category_wrap}>
                                <h3>IB 입시뉴스</h3>
                                <div className="board_wrap">
                                    <NewsItems
                                        newsContents={searchedNews}
                                        currentPage={currentPage}
                                        numShowContents={5}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        }
                        {
                            searchedBulletinBorad.length &&
                            <div className={styles.category_wrap}>
                                <h3>자유게시판</h3>
                                <div className="board_wrap">
                                    <BulletinBoardItems
                                        bulletinBoardContents={searchedBulletinBorad}
                                        currentPage={currentPage}
                                        numShowContents={5}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        }
                        {
                            searchedCoursePosts.length + searchedBulletinBorad.length + searchedMainPosts.length + searchedNews.length === 0 &&
                            <div className={styles.no_search}>
                                <FontAwesomeIcon icon={faTimesCircle} />
                                <span>검색하신 결과가 없습니다.</span>
                            </div>
                        }
                    </div>
                </main>
            </AppLayout>
        </>
    );
};

export default Search;