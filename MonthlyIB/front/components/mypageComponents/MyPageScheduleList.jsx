"use client";
import { useUserInfo, useUserStore } from "@/store/user";
import styles from "./MyPage.module.css";
import MyPageScheduleListItems from "./MyPageScheduleListItems";
import { useTutoringStore } from "@/store/tutoring";
import { useEffect, useState } from "react";

const MyPageScheduleList = () => {
  const [scheduleByYears, setScheduleByYears] = useState({});
  const { userInfo } = useUserInfo();
  const [currentPage, setCurrentPage] = useState(1);
  const { tutoringDateList, getTutoringDateList } = useTutoringStore();
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);
  const [years, setYears] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getTutoringDateList("", "", currentPage - 1, userInfo);
  }, []);
  useEffect(() => {
    if (tutoringDateList?.tutoring?.data.length > 0) {
      const year = [
        ...new Set(
          tutoringDateList?.tutoring.data.map((v) => v.date.substr(0, 4))
        ),
      ];
      setYears(year);
      const tempSchedule = {};
      tutoringDateList?.tutoring.data.map((v) =>
        tempSchedule[v.date.substr(0, 4)]
          ? tempSchedule[v.date.substr(0, 4)].push(v)
          : (tempSchedule[v.date.substr(0, 4)] = [v])
      );
      setScheduleByYears(tempSchedule);
    }
  }, [tutoringDateList]);

  return (
    <>
      <div className={styles.schedule_wrap}>
        <div className={styles.schedule_top}>
          <div className={styles.schedule_left}>
            <span>
              예약 <b id="count">{tutoringDateList?.tutoring?.data.length}</b>건
            </span>
          </div>
          <div className={styles.schedule_right}>
            <span>
              남은 예약 :{" "}
              <b id="remain">{userSubscribeInfo?.[0]?.tutoringCount}</b>
            </span>
          </div>
        </div>

        <div className={styles.schedule_cont}>
          {years.map((year) => (
            <div className={styles.schedule_list} key={year}>
              <h4 className={styles.schedule_year}>{year}</h4>
              <MyPageScheduleListItems
                scheduleContents={scheduleByYears[year]}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyPageScheduleList;
