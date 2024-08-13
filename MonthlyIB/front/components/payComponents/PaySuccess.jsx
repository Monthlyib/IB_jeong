"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./PaySuccess.module.css";

export function PaySuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      const response = await fetch(
        "https://monthlyib.server-get.site/api/order/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localUserInfo.state.userInfo.accessToken,
          },
          body: JSON.stringify(requestData),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        router.push(`/fail?message=${json.message}&code=${json.code}`);
        return;
      } else {
        console.log("pay success");
      }
      // 결제 성공 비즈니스 로직을 구현하세요.
    }
    confirm();
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
