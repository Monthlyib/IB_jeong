import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/subscribe.module.css";
import Link from "next/link";

const SubscribeComponents = ({
  valueArray,
  months,
  oriPriceArray,
  modal,
  basicOrSuper,
}) => {
  return (
    <>
      <div
        className={`${styles.plan_box} ${
          basicOrSuper === 1 ? styles.basic_plan : styles.super_plan
        }`}
      >
        <div className={styles.plan_top}>
          {basicOrSuper === 1 ? <h3>BASIC</h3> : <h3>Super</h3>}

          <div className={styles.plan_price_wrap}>
            <div className={styles.plan_price_cont}>
              <span className={styles.plan_price}>
                {valueArray[modal]} <b> / {months[modal]}</b>
              </span>
              <span className={styles.plan_month}></span>
            </div>
            <div className={styles.plan_ori_price}>{oriPriceArray[modal]}</div>
          </div>
        </div>
        <div className={styles.plan_bottom}>
          <div className={styles.plan_info}>
            <h4>플랜혜택 정보</h4>
            {basicOrSuper === 1 ? (
              <ul>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>IB 입시 정보지</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>월 3시간 1:1 Q&A 수업(6회)</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>동영상 강의 1과목</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Q&A 월 5개</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>학원 특강 수강 할인(10%)</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>튜터링 예약 6회</span>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>IB 입시 정보지</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>월 3시간 1:1 Q&A 수업(12회)</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>동영상 강의 무제한 열람</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Q&A 월 10개</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>학원 특강 수강 할인(30%)</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>튜터링 예약 12회</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Test Bank 활성화</span>
                </li>
              </ul>
            )}
          </div>
          <div className={styles.plan_btn}>
            <Link
              href={{
                pathname: "/pay/",
                query: {
                  valueArray: JSON.stringify(valueArray),
                  months: JSON.stringify(months),
                  oriPriceArray: JSON.stringify(oriPriceArray),
                  modal: JSON.stringify(modal),
                  basicOrSuper: JSON.stringify(basicOrSuper),
                },
              }}
              as={"/pay/"}
            >
              구독하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscribeComponents;
