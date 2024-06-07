"use client";
import styles from "./Subscribe.module.css";
import { useState } from "react";
import SubscribeItems from "./SubscribeItems";

const SubscribeComponents = () => {
  const [modal, setModal] = useState(0);
  const basicPriceValues = ["45만원", "90만원", "180만원", "360만원"];
  const superPriceValues = ["80만원", "150만원", "300만원", "600만원"];
  const oriBasicValues = [null, "135만원", "270만원", "540만원"];
  const oriSuperValues = [null, "240만원", "480만원", "960만원"];
  const months = ["1개월", "3개월", "6개월", "12개월"];

  return (
    <main className="width_content plan">
      <div className={styles.header_flex}>
        <div className="header_tit_wrap" style={{ marginBottom: "2.4rem" }}>
          <span>Pricing Plan</span>
          <h2>구독플랜 안내</h2>
        </div>

        <div className={styles.plan_tabs}>
          <button
            type="button"
            data-month="1"
            className={modal === 0 ? styles.active : ""}
            onClick={() => setModal(0)}
          >
            1개월
          </button>
          <button
            type="button"
            data-month="3"
            className={modal === 1 ? styles.active : ""}
            onClick={() => setModal(1)}
          >
            3개월
          </button>
          <button
            type="button"
            data-month="6"
            className={modal === 2 ? styles.active : ""}
            onClick={() => setModal(2)}
          >
            6개월
          </button>
          <button
            type="button"
            data-month="12"
            className={modal === 3 ? styles.active : ""}
            onClick={() => setModal(3)}
          >
            12개월
          </button>
        </div>
      </div>

      <div className={styles.plan_box_wrap}>
        <SubscribeItems
          valueArray={basicPriceValues}
          months={months}
          oriPriceArray={oriBasicValues}
          modal={modal}
          basicOrSuper={1}
        />
        <SubscribeItems
          valueArray={superPriceValues}
          months={months}
          oriPriceArray={oriSuperValues}
          modal={modal}
          basicOrSuper={2}
        />
      </div>
    </main>
  );
};

export default SubscribeComponents;
