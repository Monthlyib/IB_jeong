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
import { useCallback, useState } from "react";
import { useRouter } from "next/router";

const MainMid = () => {
    const router = useRouter();
    const [searchKeyword, setSearchKeyword] = useState("");
    const onChangeSearchKeyword = useCallback((e) => {
        setSearchKeyword(e.target.value)
    }, [])
    const onCheckEnter = useCallback((e) => {
        if (e.key === 'Enter') {
            if (searchKeyword !== "") {
                router.push({
                    pathname: "/search",
                    query: { keyword: searchKeyword }
                }, "/search");
            }
        }
    }, [])
    return (
        <>
            <section className={styles.search_wrap}>
                <p>궁금한 키워드를 검색해보세요!</p>
                <div className={styles.search_inner}>
                    <Link href=
                        {{
                            pathname: '/search/',
                            query: {
                                keyword: JSON.stringify(searchKeyword),
                            }
                        }}
                        as={'/search/'}><FontAwesomeIcon icon={faMagnifyingGlass} /></Link>
                    <input type="text" placeholder="궁금한 키워드를 입력해보세요" value={searchKeyword} onChange={onChangeSearchKeyword} onKeyDown={onCheckEnter} />
                </div>
            </section>

            <section className={styles.guide_wrap}>
                <h2>IB 입시가이드</h2>
                <ul className={styles.guide_inner}>
                    <li>
                        <Link href="/ib">
                            <span>월간 IB <FontAwesomeIcon icon={faAngleRight} /></span>
                            <FontAwesomeIcon icon={faBookOpen} />
                        </Link>
                    </li>
                    <li>
                        <Link href="/board">
                            <span>IB 입시 뉴스 <FontAwesomeIcon icon={faAngleRight} /></span>
                            <FontAwesomeIcon icon={faNewspaper} />
                        </Link>
                    </li>
                    <li>
                        <Link href="/board/calc">
                            <span>합격예측 계산기 <FontAwesomeIcon icon={faAngleRight} /></span>
                            <FontAwesomeIcon icon={faCalculator} />
                        </Link>
                    </li>
                    <li>
                        <Link href="/borad/guide">
                            <span>IB 수험 가이드 <FontAwesomeIcon icon={faAngleRight} /></span>
                            <FontAwesomeIcon icon={faClipboard} />
                        </Link>
                    </li>
                </ul>
            </section>
        </>
    );
};

export default MainMid; 