"use client";
import styles from "./Subscribe.module.css";
import { useEffect, useState } from "react";
import SubscribeItems from "./SubscribeItems";
import { useSubscribeStore } from "@/store/subscribe";
import { getKnitSubscribeDataList } from "@/utils/utils";
import shortid from "shortid";

const SubscribeComponents = () => {
  const [modal, setModal] = useState(0);
  const months = ["1개월", "3개월", "6개월", "12개월"];

  const { subscribeList, getSubscribeList } = useSubscribeStore();
  const [subscribeDataList, setSubscribeDataList] = useState({});
  useEffect(() => {
    getSubscribeList();
  }, []);

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

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
        {Object.keys(subscribeDataList).map((v) => (
          <SubscribeItems
            saledPrice={subscribeDataList[v]}
            months={months}
            oriPrice={subscribeDataList[v][0].price}
            modal={modal}
            planName={v}
            key={shortid.generate()}
          />
        ))}
      </div>
    </main>
  );
};

export default SubscribeComponents;
