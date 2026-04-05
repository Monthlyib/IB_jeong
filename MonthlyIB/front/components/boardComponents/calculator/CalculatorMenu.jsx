import styles from "../BoardCommon.module.css";

const CalculatorMenu = ({
  index,
  groups,
  selectedGroup,
  selectedSubject,
  selectedLevel,
  selectedPoint,
  groupUsageMap,
  levelCounts,
  onGroupChange,
  onSubjectChange,
  onLevelChange,
  onPointChange,
}) => {
  const activeGroup =
    groups.find((group) => group.key === selectedGroup) ?? null;
  const availableSubjects = activeGroup?.subjects ?? [];
  const activeSubject =
    availableSubjects.find((subject) => subject.name === selectedSubject) ?? null;
  const isLevelLocked = selectedGroup === "all" || !selectedSubject;
  const isPointLocked = isLevelLocked || selectedLevel === "all";
  const slDisabled =
    !activeSubject?.slEnabled ||
    (selectedLevel !== "sl" && levelCounts.sl >= 3);
  const hlDisabled =
    !activeSubject?.hlEnabled ||
    (selectedLevel !== "hl" && levelCounts.hl >= 4);

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
            {groups.map((group) => {
              const usedCount = groupUsageMap[group.key] ?? 0;
              const isDisabled =
                selectedGroup !== group.key &&
                usedCount >= group.maxSelectableCount;

              return (
                <option key={group.key} value={group.key} disabled={isDisabled}>
                  {group.label}
                </option>
              );
            })}
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
            {availableSubjects.map((subject) => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
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
