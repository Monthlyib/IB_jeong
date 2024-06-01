import styles from "./CourseComponents.module.css";
import { courseCategoryList } from "@/components/courseComponents/CourseComponents";

const CoursePostCategory = ({
  group,
  subject,
  level,
  handleGroupChange,
  handleSubjectChange,
  handleLevelChange,
}) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className={styles.write_link_title}>
          <p>그룹 / 과목 / 레벨</p>
        </div>
        <div className={styles.ft_select_write}>
          <select onChange={handleGroupChange} value={group}>
            <option value="all">All</option>
            <option value="Group1">Group 1</option>
            <option value="Group2">Group 2</option>
            <option value="Group3">Group 3</option>
            <option value="Group4">Group 4</option>
            <option value="Group5">Group 5</option>
            <option value="Group6">Group 6</option>
          </select>

          <select onChange={handleSubjectChange} value={subject}>
            <option value="all">All</option>
            {courseCategoryList[group]?.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select onChange={handleLevelChange} value={level}>
            <option value="all">All</option>
            <option value="SL">SL</option>
            <option value="HL">HL</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default CoursePostCategory;
