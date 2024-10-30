import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./Subscribe.module.css";
import Link from "next/link";
import { useEffect } from "react";

const SubscribeItems = ({ saledPrice, months, oriPrice, modal, planName }) => {
  const newOriPriceArray = [null, oriPrice * 3, oriPrice * 6, oriPrice * 12];



  return (
    <>
      <div
        className={`${styles.plan_box}`}
        style={{
          border: "2px solid #000",
          background: saledPrice[modal].color,
          color: saledPrice[modal].fontColor,
        }}
      >
        <div className={styles.plan_top}>
          <h3>{planName}</h3>
          <div className={styles.plan_price_wrap}>
            <div className={styles.plan_price_cont}>
              <span className={styles.plan_price}>
                {String(saledPrice[modal].price).replace(/0000$/, "")}만원
                <b> / {months[modal]}</b>
              </span>
              <span className={styles.plan_month}></span>
            </div>
            <div className={styles.plan_ori_price}>
              {newOriPriceArray[modal] !== null &&
                String(newOriPriceArray[modal]).replace(/0000$/, "")}
              {newOriPriceArray[modal] !== null && "만원"}
            </div>
          </div>
        </div>
        <div className={styles.plan_bottom}>
          <div className={styles.plan_info}>
            <h4>플랜혜택 정보</h4>
            <ul style={{ listStyle: "none" }}>
              {saledPrice[modal].content
                .trim()
                .split("\n")
                .map((v, i) => (
                  <li key={i}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>{v}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div
            className={styles.plan_btn}
            style={{
              background: saledPrice[modal].fontColor,
            }}
          >
            <Link
              href={`/pay?planName=${planName}&months=${months[modal]}&modal=${modal}`}
              style={{ color: saledPrice[modal].color }}
            >
              구독하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscribeItems;
