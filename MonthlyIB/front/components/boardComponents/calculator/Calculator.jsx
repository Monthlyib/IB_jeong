"use client";

import { useEffect, useState } from "react";
import styles from "../BoardCommon.module.css";
import BoardCommon from "../BoardCommon";
import CalculatorMenu from "./CalculatorMenu";
import { listWrap, infoWrap } from "./UniversityList";
import SchoolItems from "./SchoolItems";

const Calculator = () => {
  const numCalcMenu = [1, 2, 3, 4, 5, 6];
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalPoint, setTotalPoint] = useState(0);
  const [pointCat, setPointCat] = useState("");
  const [groups, setGroups] = useState([0, 0, 0, 0, 0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState("all");
  const [levels, setLevels] = useState([0, 0]);
  const [group, setGroup] = useState([
    "all",
    "all",
    "all",
    "all",
    "all",
    "all",
  ]);
  useEffect(() => {
    if (totalPoint >= 44) {
      setPointCat("44");
    } else if (totalPoint >= 43 && totalPoint < 44) {
      setPointCat("43");
    } else if (totalPoint >= 40 && totalPoint < 43) {
      setPointCat("40");
    } else if (totalPoint >= 37 && totalPoint < 40) {
      setPointCat("37");
    } else if (totalPoint >= 34 && totalPoint < 37) {
      setPointCat("34");
    } else if (totalPoint >= 7 && totalPoint < 34) {
      setPointCat("33");
    } else {
      setPointCat("0");
    }
    setCurrentPage(1);
  }, [totalPoint]);

  const onClickCalculating = () => {
    let temp = 0;
    for (let i = 0; i < 7; i++) {
      temp += Number(points[i]);
    }
    setTotalPoint(temp);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    console.log(country);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onClearSelect = () => {
    setPoints([0, 0, 0, 0, 0, 0, 0]);
    setGroups([0, 0, 0, 0, 0, 0]);
    setGroup(["all", "all", "all", "all", "all", "all"]);
    setTotalPoint(0);
    setCountry("all");
    setPointCat("0");
  };
  return (
    <>
      <main className="width_content archive">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Library</span>
            <h2>자료실</h2>
          </div>
        </div>

        <BoardCommon modal={1} />
        <div className={styles.calc_wrap}>
          {numCalcMenu.map((v, i) => (
            <CalculatorMenu
              index={i}
              points={points}
              setPoints={setPoints}
              groups={groups}
              setGroups={setGroups}
              group={group}
              setGroup={setGroup}
              levels={levels}
              setLevels={setLevels}
              key={i}
            />
          ))}
        </div>
        <div className={styles.calc_bottom}>
          <select
            id={styles.bonus}
            onChange={(e) => {
              let temp = [...points];
              temp[6] = e.target.value;
              setPoints(temp);
            }}
            value={points[6]}
          >
            <option value="">보너스점수 선택</option>
            <option value="1">1점</option>
            <option value="2">2점</option>
            <option value="3">3점</option>
          </select>
          <div className={styles.calc_btn}>
            <button
              type="button"
              id="btn"
              className={styles.calc_btn}
              onClick={onClickCalculating}
            >
              계산
            </button>
            <button
              type="button"
              id="reset"
              className={styles.reset_btn}
              onClick={onClearSelect}
            >
              초기화
            </button>
          </div>
        </div>
        <div className={styles.calc_result}>
          <p>
            총 점수 : <span id={styles.result}>{totalPoint}</span>점
          </p>
        </div>

        <div className={styles.recommend_schools_wrap}>
          <div className={styles.recommend_schools_top}>
            <h3>추천학교</h3>
            <select
              id={styles.recommendSchools}
              onChange={handleCountryChange}
              value={country}
            >
              <option value="all"> 국가별 </option>
              <option value="us">미국</option>
              <option value="gb">영국</option>
              <option value="sg">싱가포르</option>
              <option value="kr">한국</option>
              <option value="hk">홍콩</option>
              <option value="ca">캐나다</option>
              <option value="au">호주</option>
              <option value="jp">일본</option>
            </select>
          </div>
          <div className={styles.schools_list_wrap}>
            {listWrap[country] !== undefined ? (
              <SchoolItems
                schoolList={listWrap[country][pointCat]}
                schoolObj={infoWrap[country]}
                currentPage={currentPage}
                numShowContents={5}
                onPageChange={handlePageChange}
              />
            ) : (
              <div className={styles.no_school}>
                <p>추천학교가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Calculator;
