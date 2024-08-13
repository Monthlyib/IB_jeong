"use client";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useSubscribeStore } from "@/store/subscribe";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "08D4TrdP_HlECaXa-K44O";

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
  const planNames = [];

  if (!planName || !months) {
    return <></>;
  }

  useEffect(() => {
    const temp = [];
    temp.push(
      subscribeList.filter((item, index, array) => {
        return array.findIndex((i) => i.title === item.title) === index;
      })
    );

    for (let i = 0; i < temp[0].length; i++) {
      if (!temp[0][i].title.includes("ORI")) {
        planNames.push(temp[0][i].title);
      }
    }

    const tempObj = {};
    const newTempObj = {};
    let testingObj = {};

    for (let i = 0; i < planNames.length; i++) {
      if (!Object.keys(tempObj).includes(planNames[i])) {
        tempObj[planNames[i]] = subscribeList.filter((item) => {
          return item.title === planNames[i];
        });
        const entris = Object.entries(
          Object.values(tempObj[planNames[i]])
        ).sort((a, b) => a[1].subscribeMonthPeriod - b[1].subscribeMonthPeriod);
        let j = 0;
        for (let val of entris) {
          testingObj[j] = val[1];
          j++;
        }
        newTempObj[planNames[i]] = testingObj;
        testingObj = {};
      }
    }
    setSubscribeDataList(newTempObj);
  }, [subscribeList]);

  useEffect(() => {
    if (Object.keys(subscribeDataList).length > 0) {
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
    <div className="wrapper">
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
                orderId: "2-Vh4kU3pvIT2rxiwO37r",
                orderName: `MonthlyIB ${planName} ${months} 결제`,
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
                customerEmail: email,
                customerName: userNickname,
                // customerMobilePhone: "01012341234",
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
