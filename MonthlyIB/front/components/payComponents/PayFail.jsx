"use client";
import { useSearchParams } from "next/navigation";
import styles from "./PaySuccess.module.css";

export function PayFail() {
  const searchParams = useSearchParams();

  return (
    <div className={styles.result_wrapper}>
      <div className={styles.box_selection}>
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${searchParams.get("code")}`}</p>
        <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      </div>
    </div>
  );
}
