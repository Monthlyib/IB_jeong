"use client";
import { useUserInfo } from "@/store/user";
import styles from "./pay.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSubscribeStore } from "@/store/subscribe";
import { getKnitSubscribeDataList } from "@/utils/utils";
import Link from "next/link";
import { current } from "@reduxjs/toolkit";
import { set } from "lodash";

const PayComponents = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("planName");
  const months = searchParams.get("months");
  const modal = searchParams.get("modal")
  const { userInfo } = useUserInfo();
  const { subscribeList, getSubscribeList } = useSubscribeStore();
  const [subscribeDataList, setSubscribeDataList] = useState({});

  const [saledPrice, setSaledPrice] = useState({current: 0});
  const [subscribeId, setSubscribeId] = useState();
  const [oriPrice, setOriPrice] = useState("");

  const [email, setEmail] = useState("");
  

  useEffect(() => {
    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    getSubscribeList();
    if (localUserInfo) setEmail(localUserInfo.state.userInfo.email);
  }, []);

  useEffect(() => {
    if (planName === undefined) {
      router.push("/subscribe");
    }
  }, [planName]);

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  useEffect(() => {
    if (subscribeDataList[planName]) {
      saledPrice.current = subscribeDataList[planName][modal]?.price || 0;
      setOriPrice(subscribeDataList[planName][0]?.price*(modal== 0 ? 1 : modal*3));
      setSubscribeId(subscribeDataList[planName][modal]?.subscriberId);
    }
  }, [subscribeDataList, planName,subscribeList]);

  if (!planName || !months) {
    return <></>;
  }

  const onSumbitPay = useCallback((e) => {}, []);

  const localedCurrentValNum = String(saledPrice.current).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  let localedOriValNum = "";
  if (oriPrice !== null) {
    localedOriValNum = String(oriPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const salePrice =
    oriPrice !== null ? Number(saledPrice.current) - Number(oriPrice) : 0;
  const localedSalePrice = salePrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <main className={`width_content ${styles.pay}`}>
        <div className="header_tit_wrap" style={{ padding: "5.6rem 0 3.8rem" }}>
          <h2>결제하기</h2>
        </div>

        <div className={styles.pay_box_wrap}>
          <div className={styles.pay_left}>
            <div className={styles.product_cont}>
              <div className={styles.product_item}>
                <figure>
                  <Image
                    src={"/img/common/basic_plan.jpg"}
                    alt="베이직 구독 이미지"
                    width={100}
                    height={100}
                  />
                </figure>
                <div className={styles.product_item_info}>
                  <div className={styles.product_item_nm}>
                    <p>{planName} PLAN</p>
                  </div>
                  <div className={styles.product_item_price}>
                    <div className={styles.product_price_cont}>
                      <span className={styles.product_price}>
                        {String(saledPrice.current).replace(/0000$/, "")}만원
                      </span>
                      <b> / </b>
                      <span className={styles.product_month}> {months}</span>
                    </div>
                    <div className={styles.product_ori_price_cont}>
                      <span className={styles.product_ori_price}>
                        {oriPrice !== null &&
                          String(oriPrice).replace(/0000$/, "")}{" "}
                        {oriPrice !== null && "만원"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.pay_right}>
            <div className={styles.pay_box_top}>
              <div className={styles.buyer_info}>
                <h4>구매자 정보</h4>

                <div className={styles.buyer_input}>
                  <input
                    type="text"
                    defaultValue={userInfo?.nickname}
                    disabled
                  />
                  <input
                    type="text"
                    value={email}
                    placeholder="영수증 받으실 이메일을 입력하세요."
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.price_info}>
                <div className={styles.pricing_price}>
                  <h6>금액</h6>

                  <span>
                    <b>
                      {oriPrice !== "null"
                        ? localedOriValNum
                        : localedCurrentValNum}
                    </b>
                    원
                  </span>
                </div>
                <div className={styles.pricing_sales}>
                  <h6>할인된 금액</h6>
                  <span>
                    <b>{localedSalePrice}</b> 원
                  </span>
                </div>
                <div className={styles.pricing_total}>
                  <h6>총 결제금액</h6>
                  <span>
                    <b>{localedCurrentValNum}</b> 원
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.pay_box_bottom}>
              <Link
                href={`/tosspay?planName=${planName}&months=${months}&subscribeId=${subscribeId}`}
                style={{ color: "#fff", width: "100%" }}
              >
                <button type="submit" onClick={onSumbitPay}>
                  구매하기
                </button>
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.1rem",
                marginTop: "0.5rem",
              }}
            >
              <Link href="/refundpolicy" className={styles.refund}>
                환불정책
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PayComponents;
