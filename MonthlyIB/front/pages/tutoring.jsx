import AppLayout from "../main_components/AppLayout";
import styles from "../styles/tutoring.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import dynamic from "next/dynamic";

const Tutoring = () => {
  const [value, onChange] = useState(new Date());

  const DynamicCalendar = dynamic(
    () => import("../page_components/TutoringCalendar"),
    { ssr: false }
  );

  return (
    <>
      <AppLayout>
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
                  value={value}
                  onChange={onChange}
                />

                <div className={styles.calendar_info}>
                  <div className={styles.calendar_item}>
                    <span
                      className={`${styles.label} ${styles.possible}`}
                    ></span>
                    <span>예약가능</span>
                  </div>
                  <div className={styles.calendar_item}>
                    <span className={`${styles.label} ${styles.active}`}></span>
                    <span>선택</span>
                  </div>
                </div>
              </div>
              {/*  캘린더 API 연동후에 고칠것 */}
              <div className={styles.sc_right_cont}>
                <div className={styles.sc_time_wrap}>
                  <h6>시간 선택</h6>
                  <div className={styles.sc_time_select}>
                    <ul>
                      <li>
                        <a href="">10:30</a>
                      </li>
                      <li className={styles.active}>
                        <a href="">11:00</a>
                      </li>
                      <li className={styles.none}>
                        <a href="">11:30</a>
                      </li>
                      <li>
                        <a href="">12:00</a>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.calendar_info}>
                    <div className={styles.calendar_item}>
                      <span className={`${styles.label} ${styles.none}`}></span>
                      <span>선택불가</span>
                    </div>
                    <div className={styles.calendar_item}>
                      <span
                        className={`${styles.label} ${styles.active}`}
                      ></span>
                      <span>선택</span>
                    </div>
                  </div>
                </div>

                <div className={styles.sc_description}>
                  <h6>예약 상세설명</h6>
                  <textarea
                    name="scheduling"
                    id={styles.scheduling}
                    placeholder="상세내용을 입력해주세요."
                  ></textarea>
                </div>

                <div className={styles.center_btn_wrap}>
                  <a herf="">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    예약하기
                  </a>
                </div>

                <div className={styles.sc_over}>
                  <span>
                    남은예약 : <b className="count">9</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </>
  );
};

export default Tutoring;
