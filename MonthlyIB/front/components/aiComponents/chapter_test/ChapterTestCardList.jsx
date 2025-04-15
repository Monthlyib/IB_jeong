import React from "react";
import styles from "./ChapterTestList.module.css";
import Link from 'next/link';
import { deleteChapterTest } from "@/apis/AiChapterTestAPI";
import { useUserInfo } from "@/store/user";

const ChapterTestCardList = ({ questions }) => {
    const { userInfo } = useUserInfo();
    return (
        <ul className={styles.list}>
            {questions.map((q) => (
                <li key={q.id} className={styles.item}>
                    <div className={styles.question} dangerouslySetInnerHTML={{ __html: q.question }} />
                    <ul className={styles.choices}>
                        <li className={styles.choice}>A. <span dangerouslySetInnerHTML={{ __html: q.choiceA }} /></li>
                        <li className={styles.choice}>B. <span dangerouslySetInnerHTML={{ __html: q.choiceB }} /></li>
                        <li className={styles.choice}>C. <span dangerouslySetInnerHTML={{ __html: q.choiceC }} /></li>
                        <li className={styles.choice}>D. <span dangerouslySetInnerHTML={{ __html: q.choiceD }} /></li>
                    </ul>
                    <div className={styles.answer}>정답: {q.answer}</div>
                    <div className={styles.actions}>
                        <Link href={`/aitools/chapter-test/edit/${q.id}`} className={styles.editButton}>
                            수정
                        </Link>
                        <button
                            className={styles.deleteButton}
                            onClick={async () => {
                                if (window.confirm("정말로 이 문제를 삭제하시겠습니까?")) {
                                    try {
                                        await deleteChapterTest(q.id, userInfo);
                                        window.location.reload();
                                    } catch (err) {
                                        alert("삭제에 실패했습니다.");
                                        console.error(err);
                                    }
                                }
                            }}
                        >
                            삭제
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ChapterTestCardList;
