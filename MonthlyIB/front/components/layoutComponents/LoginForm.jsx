import styles from "./LoginForm.module.css";
import Link from "next/link";

const LoginForm = () => {
  return (
    <div className={styles.util}>
      <Link href="/login">로그인</Link>
      <Link href="/subscribe">구독플랜</Link>
    </div>
  );
};

export default LoginForm;
