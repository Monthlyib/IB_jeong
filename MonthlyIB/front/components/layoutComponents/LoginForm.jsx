"use client";

import styles from "./LoginForm.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useUserInfo } from "@/store/user";

const LoginForm = () => {
  const router = useRouter();
  const { signOut } = useUserInfo();

  const handleLoginRedirect = useCallback(() => {
    signOut();
    router.push("/login");
  }, [router, signOut]);

  return (
    <div className={styles.util}>
      <button type="button" className={styles.loginLink} onClick={handleLoginRedirect}>
        로그인
      </button>
      <Link href="/subscribe">구독플랜</Link>
    </div>
  );
};

export default LoginForm;
