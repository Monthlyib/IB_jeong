"use client";
import styles from "./Tutoring.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import shortid from "shortid";
import { useTutoringStore } from "@/store/tutoring";
import { useUserStore } from "@/store/user";

const DynamicCalendar = dynamic(() => import("./TutoringCalendar"), {
  ssr: false,
});

const TIME_TABLE_OBJECT = {
  9: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  10: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  11: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  12: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  13: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  14: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  15: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  16: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  17: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  18: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  19: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  20: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
  21: {
    0: { select: false, counts: 0 },
    30: { select: false, counts: 0 },
  },
};

const TutoringComponents = () => {
  const [date, setDate] = useState("");
  const [timeTable, setTimeTable] = useState(TIME_TABLE_OBJECT);
  const { userInfo } = useUserStore();
  const { tutoringDateSimpleList, getTutoringDateSimpleList, postTutoring } =
    useTutoringStore();
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const detail = useRef("");

  const onClickTime = (h, m) => {
    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
    );
    temp[h][m]["select"] = true;
    setTimeTable(temp);
    setHour(parseInt(h));
    setMinute(parseInt(m));
  };

  const onChangeDetail = (e) => {
    detail.current = e.target.value;
  };

  const onSubmit = (e) => {
    postTutoring(
      userInfo?.userId,
      date,
      hour,
      minute,
      detail.current,
      userInfo
    );
    detail.current = "";
    setDate("");

    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
    );
    setTimeTable(temp);
  };

  const handleResetState = () => {
    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => (temp[k][v]["counts"] = 0))
    );
    setTimeTable(temp);
  };

  const handleUpdateState = useCallback(
    (tutoringDateSimpleList) => {
      if (tutoringDateSimpleList?.currentTutoring.length > 0) {
        const temp = { ...timeTable };
        for (
          let i = 0;
          i < tutoringDateSimpleList?.currentTutoring.length;
          i++
        ) {
          if (
            tutoringDateSimpleList.currentTutoring[i].tutoringList.length > 0
          ) {
            const h = tutoringDateSimpleList?.currentTutoring[i].hour;
            const m = tutoringDateSimpleList?.currentTutoring[i].minute;
            temp[h][m].counts =
              tutoringDateSimpleList.currentTutoring[i].tutoringList.length;
          }
        }
      }
    },
    [date, tutoringDateSimpleList]
  );
  useEffect(() => {
    if (date) {
      handleResetState();
      handleUpdateState(tutoringDateSimpleList);
    }
  }, [tutoringDateSimpleList]);
  useEffect(() => {
    if (date) {
      getTutoringDateSimpleList(date, userInfo);
    }
  }, [date]);

  return (
    <>
      <main className="width_content scheduling">
        <div className="header_flex">
          <div className="header_tit_wrap">
            <span>Scheduling Tutoring</span>
            <h2>튜터링 예약</h2>
          </div>
        </div>

        <div className={styles.sc_main_wrap}>
          <div className={styles.sc_main_cont}>
            <div className={styles.sc_left_cont}>
              <h6>날짜 선택</h6>

              <DynamicCalendar
                styles={styles.calendar}
                value={date}
                setValue={setDate}
              />

              <div className={styles.calendar_info}>
                <div className={styles.calendar_item}>
                  <span className={`${styles.label} ${styles.possible}`}></span>
                  <span>예약가능</span>
                </div>
                <div className={styles.calendar_item}>
                  <span className={`${styles.label} ${styles.active}`}></span>
                  <span>선택</span>
                </div>
                <div className={styles.calendar_item}>
                  <span className={`${styles.label} ${styles.today}`}></span>
                  <span>오늘</span>
                </div>
              </div>
            </div>
            <div className={styles.sc_right_cont}>
              <div className={styles.sc_time_wrap}>
                <h6>시간 선택 (KST)</h6>
                <div className={styles.sc_time_select}>
                  <ul style={{ listStyle: "none" }}>
                    {Object.entries(timeTable).map(([k, v]) =>
                      Object.keys(v).map((m) => (
                        <li
                          key={shortid.generate()}
                          className={
                            userInfo?.userStatus === "ACTIVE"
                              ? timeTable[k][m]["counts"] >= 3
                                ? styles.none
                                : timeTable[k][m]["select"] === true
                                ? styles.active
                                : undefined
                              : styles.none
                          }
                        >
                          <button
                            className={
                              timeTable[k][m]["counts"] >= 3
                                ? styles.none
                                : timeTable[k][m]["select"] === true
                                ? styles.active
                                : undefined
                            }
                            onClick={() => onClickTime(k, m)}
                          >
                            {k}:{m === "0" ? `${m}0` : m}
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className={styles.calendar_info}>
                  <div className={styles.calendar_item}>
                    <span className={`${styles.label} ${styles.none}`}></span>
                    <span>선택불가</span>
                  </div>
                  <div className={styles.calendar_item}>
                    <span
                      className={`${styles.label} ${styles.time_selected}`}
                    ></span>
                    <span>선택</span>
                  </div>
                </div>
              </div>
              <form onSubmit={onSubmit}>
                <div className={styles.sc_description}>
                  <h6>예약 상세설명</h6>
                  <textarea
                    name="scheduling"
                    id={styles.scheduling}
                    placeholder={`상세내용을 입력해주세요.\n
                    1. 과목 및 챕터
                    2. 수업내용 e.g. IA 주제선정, 내신정리
                    3. 기타 추가 요청사항\n\n수업 확정 여부는 이메일로 전달드립니다~`}
                    defaultValue={detail.current}
                    onChange={onChangeDetail}
                  ></textarea>
                </div>

                <div className={styles.center_btn_wrap}>
                  <button type="submit" disabled={date == "" || hour == 0}>
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    예약하기
                  </button>
                </div>
              </form>

              <div className={styles.sc_over}>
                <span>
                  남은예약 : <b className="count">9</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TutoringComponents;
