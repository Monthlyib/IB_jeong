"use client";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useSubscribeStore } from "@/store/subscribe";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getKnitSubscribeDataList } from "@/utils/utils";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
const customerKey = "08D4TrdP_HlECaXa-K44O";

function generateOrderId(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export function TossCheckOut() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 1,
  });
  const searchParams = useSearchParams();
  const planName = searchParams.get("planName");
  const months = searchParams.get("months");
  const [userNickname, setUserNickname] = useState("");
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const { subscribeList, getSubscribeList } = useSubscribeStore();
  const monthsArray = ["1개월", "3개월", "6개월", "12개월"];
  const [subscribeDataList, setSubscribeDataList] = useState({});

  const index = monthsArray.findIndex((v) => v === months);

  useEffect(() => {
    // loading userInfo and loading subscribe lists
    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    getSubscribeList();
    if (localUserInfo) {
      setEmail(localUserInfo.state.userInfo.email);
      setUserNickname(localUserInfo.state.userInfo.nickname);
    }
  }, []);

  if (!planName || !months) {
    return <></>;
  }

  useEffect(() => {
    getKnitSubscribeDataList(subscribeList, setSubscribeDataList);
  }, [subscribeList]);

  useEffect(() => {
    if (Object.keys(subscribeDataList).length > 0) {
      console.log(subscribeDataList);
      const temp = { ...amount };
      temp["value"] = subscribeDataList[planName][index].price;
      setAmount(temp);
    }
  }, [subscribeDataList]);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div className="wrapper" style={{ marginTop: "5rem" }}>
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}

        {/* 결제하기 버튼 */}
        <button
          className="button"
          style={{
            display: "flex",
            margin: "0 auto",
            marginBottom: "5rem",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "1rem",
            background: "#3182F6",
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: "600",
            width: "60%",
            height: "7.2rem",
          }}
          disabled={!ready}
          onClick={async () => {
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets.requestPayment({
                orderId: generateOrderId(21),
                orderName: `MonthlyIB ${planName} ${months} 결제`,
                successUrl:
                  window.location.origin +
                  `/success?subscribeId=${searchParams.get("subscribeId")}`,
                failUrl: window.location.origin + "/fail",
                customerEmail: email,
                customerName: userNickname,
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default TossCheckOut;
