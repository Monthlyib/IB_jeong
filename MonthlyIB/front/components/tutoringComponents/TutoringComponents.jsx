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

  // 다중 선택된 시간 목록: [{ id, date, hour, minute }]
  const [selectedSlots, setSelectedSlots] = useState([]);

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
    if (!date) return; // 날짜가 선택되어야 함

    // 이미 선택됐는지 확인 (같은 날짜+시간 중복 방지)
    const existsIdx = selectedSlots.findIndex(
      (s) => s.date === date && s.hour === parseInt(h) && s.minute === parseInt(m)
    );

    const temp = { ...timeTable };

    if (existsIdx > -1) {
      // 이미 선택된 항목이면 토글 해제
      temp[h][m]["select"] = false;
      setTimeTable(temp);
      const next = [...selectedSlots];
      next.splice(existsIdx, 1);
      setSelectedSlots(next);
    } else {
      // 최대 3개 제한
      if (selectedSlots.length >= 3) return;

      // 선택 불가(이미 3명 예약된 슬롯)라면 무시
      if (temp[h][m]["counts"] >= 3) return;

      temp[h][m]["select"] = true;
      setTimeTable(temp);

      const newItem = {
        id: `${date}-${h}-${m}`,
        date,
        hour: parseInt(h),
        minute: parseInt(m),
      };
      setSelectedSlots((prev) => [...prev, newItem]);

      // 기존 단일 state도 유지(호환 목적)
      setHour(parseInt(h));
      setMinute(parseInt(m));
    }
  };

  // 상세 설명 입력 시 상태 업데이트
  const onChangeDetail = (e) => {
    detail.current = e.target.value;
  };

  const removeSlot = (idToRemove) => {
    const found = selectedSlots.find((s) => s.id === idToRemove);
    if (found && found.date === date && timeTable[found.hour] && timeTable[found.hour][found.minute] !== undefined) {
      const temp = { ...timeTable };
      temp[found.hour][found.minute]["select"] = false;
      setTimeTable(temp);
    }
    setSelectedSlots((prev) => prev.filter((s) => s.id !== idToRemove));
  };

  // 예약을 제출하는 함수
  const onSubmit = () => {
    if (
      userSubscribeInfo?.[0]?.tutoringCount > 0 &&
      userSubscribeInfo?.[0]?.subscribeStatus === "ACTIVE" &&
      selectedSlots.length > 0
    ) {
      // 선택된 슬롯 각각에 대해 예약 요청
      selectedSlots.forEach((slot) => {
        postTutoring(
          userInfo?.userId,
          slot.date,
          slot.hour,
          slot.minute,
          detail.current,
          userInfo
        );
      });

      // 예약 완료 후 필드 및 상태 초기화
      detail.current = "";
      setDate("");

      const temp = { ...timeTable };
      Object.keys(temp).forEach((k) =>
        Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
      );
      setTimeTable(temp);
      setSelectedSlots([]);
    }
  };

  // 시간표 상태 초기화 (예약 가능한 시간 설정)
  const handleResetState = () => {
    const temp = { ...timeTable };
    Object.keys(temp).forEach((k) =>
      Object.keys(temp[k]).forEach((v) => {
        temp[k][v]["counts"] = 0;
        temp[k][v]["select"] = false; // 날짜 변경 시 화면 선택 초기화
      })
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

  // 날짜 변경 시 현재 날짜 그리드의 선택만 리셋 (선택 목록은 유지)
  useEffect(() => {
    if (date) {
      const temp = { ...timeTable };
      Object.keys(temp).forEach((k) =>
        Object.keys(temp[k]).forEach((v) => (temp[k][v]["select"] = false))
      );
      setTimeTable(temp);
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
                  <ul className={styles.timeList}>
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

                {/* 선택된 날짜/시간 목록 표시 (최대 3개) */}
                <div className={`${styles.calendar_info} ${styles.selectedSlotsWrap}`}>
                  {selectedSlots.length === 0 ? (
                    <div className={styles.calendar_item}>
                      <span>선택된 시간 없음 (최대 3개까지 선택 가능)</span>
                    </div>
                  ) : (
                    selectedSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={styles.slotChip}
                      >
                        <span>
                          {slot.date} {String(slot.hour).padStart(2, "0")}:
                          {String(slot.minute).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSlot(slot.id)}
                          aria-label="remove selected slot"
                          className={styles.chipRemoveBtn}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
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
                      selectedSlots.length === 0 ||
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
