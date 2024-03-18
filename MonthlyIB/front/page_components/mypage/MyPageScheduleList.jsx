import { useSelector } from "react-redux";
import styles from "./MyPage.module.css";
import MyPageScheduleListItems from "./MyPageScheduleListItems";

const MyPageScheduleList = () => {
  const { User } = useSelector((state) => state.user);

  const years = [...new Set(User.tutors.map((v) => v.Date.substr(0, 4)))];
  const scheduleByYears = {};
  User.tutors.map((v) =>
    scheduleByYears[v.Date.substr(0, 4)]
      ? scheduleByYears[v.Date.substr(0, 4)].push(v)
      : (scheduleByYears[v.Date.substr(0, 4)] = [v])
  );
  return (
    <>
      <div className={styles.schedule_wrap}>
        <div className={styles.schedule_top}>
          <div className={styles.schedule_left}>
            <span>
              예약 <b id="count">{User.tutors.length}</b>건
            </span>
          </div>
          <div className={styles.schedule_right}>
            <span>
              남은 예약 : <b id="remain">{User?.plan?.tutorAssigns ?? 0}</b>
            </span>
          </div>
        </div>

        <div className={styles.schedule_cont}>
          {years.map((year) => (
            <div className={styles.schedule_list} key={year}>
              <h4 className={styles.schedule_year}>{year}</h4>
              <MyPageScheduleListItems
                scheduleContents={scheduleByYears[year]}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyPageScheduleList;
