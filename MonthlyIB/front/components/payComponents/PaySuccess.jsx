"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { payConfirm } from "@/apis/payAPI";
import styles from "./PaySuccess.module.css";

export function PaySuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const requestData = {
      subscribeId: searchParams.get("subscribeId"),
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm(requestData) {
      const res = await payConfirm(
        requestData.subscribeId,
        requestData.orderId,
        requestData.amount,
        requestData.paymentKey,
        localUserInfo.state.userInfo
      );
      if (!res.ok) {
        router.push(`/fail?message=${json.message}&code=${json.code}`);
        return;
      } else {
        console.log("pay success");
      }
    }

    confirm(requestData);
  }, []);

  return (
    <div className={styles.result_wrapper}>
      <div className={styles.box_selection}>
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}
