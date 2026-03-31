"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../BoardCommon.module.css";
import BoardCommon from "../BoardCommon";
import CalculatorMenu from "./CalculatorMenu";
import { listWrap, infoWrap } from "./UniversityList";
import SchoolItems from "./SchoolItems";

const Calculator = () => {
  const numCalcMenu = [1, 2, 3, 4, 5, 6];
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState("all");
  const [selectedLevels, setSelectedLevels] = useState([
    "all",
    "all",
    "all",
    "all",
    "all",
    "all",
  ]);
  const [selectedSubjects, setSelectedSubjects] = useState([
    "all",
    "all",
    "all",
    "all",
    "all",
    "all",
  ]);
  const [selectedGroups, setSelectedGroups] = useState([
    "all",
    "all",
    "all",
    "all",
    "all",
    "all",
  ]);

  const totalPoint = useMemo(
    () => points.reduce((sum, value) => sum + Number(value || 0), 0),
    [points]
  );

  const pointCat = useMemo(() => {
    if (totalPoint >= 44) {
      return "44";
    }
    if (totalPoint >= 43) {
      return "43";
    }
    if (totalPoint >= 40) {
      return "40";
    }
    if (totalPoint >= 37) {
      return "37";
    }
    if (totalPoint >= 34) {
      return "34";
    }
    if (totalPoint >= 7) {
      return "33";
    }
    return "0";
  }, [totalPoint]);

  const groupCounts = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) =>
        selectedGroups.filter((value) => value === `Group${index + 1}`).length
      ),
    [selectedGroups]
  );

  const levelCounts = useMemo(
    () => ({
      sl: selectedLevels.filter((value) => value === "sl").length,
      hl: selectedLevels.filter((value) => value === "hl").length,
    }),
    [selectedLevels]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [totalPoint, country]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGroupChange = (index, value) => {
    const nextGroups = [...selectedGroups];
    nextGroups[index] = value;
    setSelectedGroups(nextGroups);

    const nextSubjects = [...selectedSubjects];
    nextSubjects[index] = "all";
    setSelectedSubjects(nextSubjects);

    const nextLevels = [...selectedLevels];
    nextLevels[index] = "all";
    setSelectedLevels(nextLevels);

    const nextPoints = [...points];
    nextPoints[index] = 0;
    setPoints(nextPoints);
  };

  const handleSubjectChange = (index, value) => {
    const nextSubjects = [...selectedSubjects];
    nextSubjects[index] = value;
    setSelectedSubjects(nextSubjects);

    const nextLevels = [...selectedLevels];
    nextLevels[index] = "all";
    setSelectedLevels(nextLevels);

    const nextPoints = [...points];
    nextPoints[index] = 0;
    setPoints(nextPoints);
  };

  const handleLevelChange = (index, value) => {
    const nextLevels = [...selectedLevels];
    nextLevels[index] = value;
    setSelectedLevels(nextLevels);

    const nextPoints = [...points];
    nextPoints[index] = 0;
    setPoints(nextPoints);
  };

  const handlePointChange = (index, value) => {
    const nextPoints = [...points];
    nextPoints[index] = Number(value);
    setPoints(nextPoints);
  };

  const onClearSelect = () => {
    setPoints([0, 0, 0, 0, 0, 0, 0]);
    setSelectedLevels(["all", "all", "all", "all", "all", "all"]);
    setSelectedSubjects(["all", "all", "all", "all", "all", "all"]);
    setSelectedGroups(["all", "all", "all", "all", "all", "all"]);
    setCountry("all");
    setCurrentPage(1);
  };
  return (
    <>
      <main className="width_content archive">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Library</span>
            <h2>IB 성적 계산기</h2>
          </div>
        </div>

        <BoardCommon modal={1} />
        <section className={styles.calcHero}>
          <div className={styles.calcHeroCopy}>
            <span className={styles.calcEyebrow}>IB Score Planner</span>
            <h3>과목 점수를 한 번에 정리하고 추천 학교를 바로 확인하세요</h3>
            <p>
              그룹, 과목, 레벨, 점수를 순서대로 선택하면 총점과 추천 학교가 자동으로
              갱신됩니다.
            </p>
          </div>
          <div className={styles.calcSummaryGrid}>
            <div className={styles.calcSummaryCard}>
              <span>총점</span>
              <strong>{totalPoint}점</strong>
            </div>
            <div className={styles.calcSummaryCard}>
              <span>보너스</span>
              <strong>{points[6]}점</strong>
            </div>
            <div className={styles.calcSummaryCard}>
              <span>HL / SL</span>
              <strong>
                {levelCounts.hl} / {levelCounts.sl}
              </strong>
            </div>
            <div className={styles.calcSummaryCard}>
              <span>학교 필터</span>
              <strong>{country === "all" ? "전체 국가" : country.toUpperCase()}</strong>
            </div>
          </div>
        </section>

        <section className={styles.calcPanel}>
          <div className={styles.calcPanelHeader}>
            <div>
              <span className={styles.calcPanelEyebrow}>Step 1</span>
              <h3>과목별 점수 입력</h3>
            </div>
            <p>총 6개 과목과 TOK/EE 보너스를 입력하면 추천 학교가 자동으로 바뀝니다.</p>
          </div>
          <div className={styles.calc_wrap}>
            {numCalcMenu.map((_, i) => (
              <CalculatorMenu
                index={i}
                selectedGroup={selectedGroups[i]}
                selectedSubject={selectedSubjects[i]}
                selectedLevel={selectedLevels[i]}
                selectedPoint={points[i]}
                groupCounts={groupCounts}
                levelCounts={levelCounts}
                onGroupChange={handleGroupChange}
                onSubjectChange={handleSubjectChange}
                onLevelChange={handleLevelChange}
                onPointChange={handlePointChange}
                key={i}
              />
            ))}
          </div>
          <div className={styles.calc_bottom}>
            <div className={styles.bonusCard}>
              <label className={styles.calcLabel} htmlFor="bonusScore">
                Bonus Score
              </label>
              <select
                id="bonusScore"
                className={styles.bonusSelect}
                onChange={(e) => {
                  const nextPoints = [...points];
                  nextPoints[6] = Number(e.target.value);
                  setPoints(nextPoints);
                }}
                value={points[6]}
              >
                <option value="0">보너스 점수 선택</option>
                <option value="1">1점</option>
                <option value="2">2점</option>
                <option value="3">3점</option>
              </select>
            </div>
            <div className={styles.calcActionArea}>
              <p className={styles.calcHint}>점수는 자동으로 계산됩니다.</p>
              <button
                type="button"
                id="reset"
                className={styles.reset_btn}
                onClick={onClearSelect}
              >
                전체 초기화
              </button>
            </div>
          </div>
          <div className={styles.calc_result}>
            <div className={styles.calcResultCard}>
              <span>Predicted IB Total</span>
              <strong>{totalPoint}</strong>
              <p>추천 학교 기준 점수대: {pointCat === "0" ? "계산 전" : `${pointCat}+`}</p>
            </div>
          </div>
        </section>

        <section className={styles.recommend_schools_wrap}>
          <div className={styles.recommend_schools_top}>
            <div>
              <span className={styles.calcPanelEyebrow}>Step 2</span>
              <h3>추천 학교</h3>
            </div>
            <select
              className={styles.recommendSchoolsSelect}
              onChange={handleCountryChange}
              value={country}
            >
              <option value="all">전체 국가</option>
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
        </section>
      </main>
    </>
  );
};

export default Calculator;
