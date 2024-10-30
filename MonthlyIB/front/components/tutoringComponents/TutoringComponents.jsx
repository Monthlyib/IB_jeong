"use client";
import styles from "./Tutoring.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import shortid from "shortid";
import { useTutoringStore } from "@/store/tutoring";
import { useUserInfo, useUserStore } from "@/store/user";

// 비동기 로드로 캘린더 컴포넌트를 불러옵니다 (SSR 비활성화)
const DynamicCalendar = dynamic(() => import("./TutoringCalendar"), {
  ssr: false,
});

// 시간표 객체 초기값 설정: 각 시간대의 선택 여부와 예약 수
const TIME_TABLE_OBJECT = {
  9: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  10: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  11: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  12: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  13: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  14: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  15: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  16: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  17: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  18: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  19: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  20: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
  21: { 0: { select: false, counts: 0 }, 30: { select: false, counts: 0 } },
};

const TutoringComponents = () => {
  // State 설정
  const [date, setDate] = useState(""); // 예약 날짜
  const [timeTable, setTimeTable] = useState(TIME_TABLE_OBJECT); // 시간표 상태
  const { userInfo } = useUserInfo(); // 사용자 정보 가져오기
  const { tutoringDateSimpleList, getTutoringDateSimpleList, postTutoring } =
    useTutoringStore(); // 예약 관련 Store 가져오기
  const [hour, setHour] = useState(0); // 선택한 시간의 시간 부분
  const [minute, setMinute] = useState(0); // 선택한 시간의 분 부분
  const detail = useRef(""); // 예약 상세 설명
  const { userSubscribeInfo, getUserSubscribeInfo } = useUserStore(); // 구독 정보 가져오기

  // 컴포넌트 마운트 시 구독 정보 불러오기
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userInfo"));
    if (localUser)
      getUserSubscribeInfo(
        localUser.state.userInfo.userId,
        0,
        localUser.state.userInfo
      );
  }, []);

  // 시간표에서 특정 시간을 클릭하여 선택할 때 호출되는 함수
  const onClickTime = (h, m) => {
    // 모든 시간을 비활성화하고 클릭한 시간만 활성화
    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
    );
    temp[h][m]["select"] = true; // 선택한 시간 활성화
    setTimeTable(temp);
    setHour(parseInt(h));
    setMinute(parseInt(m));
  };

  // 상세 설명 입력 시 상태 업데이트
  const onChangeDetail = (e) => {
    detail.current = e.target.value;
  };

  // 예약을 제출하는 함수
  const onSubmit = () => {
    // 조건 확인 후, 사용자의 예약이 가능한 경우 예약을 진행
    if (
      userSubscribeInfo?.[0]?.tutoringCount > 0 &&
      userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE"
    ) {
      postTutoring(
        userInfo?.userId,
        date,
        hour,
        minute,
        detail.current,
        userInfo
      );
      // 예약 완료 후 필드 초기화
      detail.current = "";
      setDate("");

      // 시간표에서 선택된 시간 초기화
      const temp = { ...timeTable };
      Object.keys(temp).forEach((k) =>
        Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
      );
      setTimeTable(temp);
    }
  };

  // 시간표 상태 초기화 (예약 가능한 시간 설정)
  const handleResetState = () => {
    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => (temp[k][v]["counts"] = 0))
    );
    setTimeTable(temp);
  };

  // 예약 데이터 업데이트: 선택된 날짜의 예약 수를 가져와 시간표 상태 업데이트
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

  // 선택한 날짜의 예약 데이터 불러오기
  useEffect(() => {
    if (date) {
      handleResetState();
      handleUpdateState(tutoringDateSimpleList);
    }
  }, [tutoringDateSimpleList]);
  
  // 날짜 선택 시, 해당 날짜의 예약 정보를 가져옴
  useEffect(() => {
    if (date) {
      getTutoringDateSimpleList(date, userInfo);
    }
  }, [date]);

  return (
    <>
      <main className="width_content scheduling">
        {/* 페이지 헤더 */}
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

              {/* 캘린더 컴포넌트 */}
              <DynamicCalendar
                styles={styles.calendar}
                value={date}
                setValue={setDate}
              />

              {/* 캘린더 정보 표시 */}
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

            {/* 시간 선택 및 예약 폼 */}
            <div className={styles.sc_right_cont}>
              <div className={styles.sc_time_wrap}>
                <h6>시간 선택 (KST)</h6>
                <div className={styles.sc_time_select}>
                  <ul style={{ listStyle: "none" }}>
                    {/* 시간표에서 예약 가능 여부에 따라 버튼 상태를 결정 */}
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

                {/* 시간 선택 정보 표시 */}
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

              {/* 예약 상세 설명 입력 폼 */}
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

                {/* 예약 버튼 */}
                <div className={styles.center_btn_wrap}>
                  <button
                    type="submit"
                    disabled={
                      date == "" ||
                      hour == 0 ||
                      userSubscribeInfo?.[0]?.tutoringCount === 0 ||
                      userSubscribeInfo?.[0]?.subscribeStatus !== "ACTIVE"
                    }
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    예약하기
                  </button>
                </div>
              </form>

              {/* 남은 예약 수 표시 */}
              <div className={styles.sc_over}>
                <span>
                  남은예약 :{" "}
                  <b className="count">
                    {userSubscribeInfo?.[0]?.tutoringCount}
                  </b>
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
