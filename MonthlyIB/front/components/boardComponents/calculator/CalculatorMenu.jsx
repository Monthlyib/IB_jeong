import styles from "../BoardCommon.module.css";

const CalculatorMenu = ({
  index,
  selectedGroup,
  selectedSubject,
  selectedLevel,
  selectedPoint,
  groupCounts,
  levelCounts,
  onGroupChange,
  onSubjectChange,
  onLevelChange,
  onPointChange,
}) => {
  const courseCategoryList = {
    all: [],
    Group1: ["English Literature", "English Language ", "Korean"],
    Group2: ["English B", "Mandarin B", "Spanish B"],
    Group3: [
      "Economics",
      "Business & Management",
      "Psychology",
      "Geography",
      "History",
      "Global Politics",
      "Digital Society",
      "Philosophy",
      "Social & Cultural Anthropology",
      "World Religions",
    ],
    Group4: [
      "Physics",
      "Chemistry",
      "Biology",
      "Design Technology",
      "Sports, Exercise & Health Science",
      "Environmental System & Societies",
    ],
    Group5: ["Math AA", "Math AI"],
    Group6: ["Visual Arts", "Dance", "Music", "Film", "Theatre"],
  };

  const availableSubjects = courseCategoryList[selectedGroup] ?? [];
  const isLevelLocked = selectedGroup === "all" || !selectedSubject;
  const isPointLocked = isLevelLocked || selectedLevel === "all";
  const slDisabled =
    selectedSubject === "World Religions" || levelCounts.sl >= 3;
  const hlDisabled = levelCounts.hl >= 4;

  return (
    <div className={styles.calcCard}>
      <div className={styles.calcCardHeader}>
        <div>
          <span className={styles.calcCardEyebrow}>Subject {index + 1}</span>
          <strong>과목 {index + 1}</strong>
        </div>
        <span className={styles.calcCardStatus}>
          {selectedPoint > 0 ? `${selectedPoint}점` : "미입력"}
        </span>
      </div>
      <div className={styles.calc_list}>
        <div className={styles.calcSelectBlock}>
          <label className={styles.calcLabel}>Group</label>
          <select
            className={styles.calcSelect}
            onChange={(e) => onGroupChange(index, e.target.value)}
            value={selectedGroup}
          >
            <option value="all">그룹 선택</option>
            {groupCounts.map((value, i) =>
              i < 4 && value < 2 ? (
                <option key={i} value={`Group${i + 1}`}>
                  {`Group ${i + 1}`}
                </option>
              ) : i >= 4 && value < 1 ? (
                <option key={i} value={`Group${i + 1}`}>
                  {`Group ${i + 1}`}
                </option>
              ) : (
                <option key={i} value={`Group${i + 1}`} disabled>
                  {`Group ${i + 1}`}
                </option>
              )
            )}
          </select>
        </div>
        <div className={`${styles.calcSelectBlock} ${styles.isWide}`}>
          <label className={styles.calcLabel}>Subject</label>
          <select
            className={`${styles.calcSelect} ${styles.subjectSelect}`}
            onChange={(e) => onSubjectChange(index, e.target.value)}
            value={selectedSubject}
            disabled={selectedGroup === "all"}
          >
            <option value="all">과목 선택</option>
            {availableSubjects.map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.calcSelectBlock}>
          <label className={styles.calcLabel}>Level</label>
          <select
            className={styles.calcSelect}
            onChange={(e) => onLevelChange(index, e.target.value)}
            value={selectedLevel}
            disabled={isLevelLocked}
          >
            <option value="all">레벨 선택</option>
            <option value="sl" disabled={slDisabled}>
              SL
            </option>
            <option value="hl" disabled={hlDisabled}>
              HL
            </option>
          </select>
        </div>
        <div className={styles.calcSelectBlock}>
          <label className={styles.calcLabel}>Score</label>
          <select
            className={styles.calcSelect}
            onChange={(e) => onPointChange(index, e.target.value)}
            value={selectedPoint}
            disabled={isPointLocked}
          >
            <option value="0">점수 선택</option>
            <option value="1">1점</option>
            <option value="2">2점</option>
            <option value="3">3점</option>
            <option value="4">4점</option>
            <option value="5">5점</option>
            <option value="6">6점</option>
            <option value="7">7점</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CalculatorMenu;
