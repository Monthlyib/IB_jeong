"use client";

import React from "react";
import styles from "./DescriptiveTestCardList.module.css";
import Link from 'next/link';
import { useUserInfo } from "@/store/user";
import { deleteDescriptiveTest } from "@/apis/AiDescriptiveTestAPI";

const DescriptiveTestCardList = ({ questions }) => {
    const { userInfo } = useUserInfo();
    
    return (
        <ul className={styles.list}>
            {questions.map((q) => (
                <li key={q.id} className={styles.item}>
                    <div className={styles.content}>
                        <div className={styles.question} dangerouslySetInnerHTML={{ __html: q.question }} />
                        {q.imagePath && (
                          <div className={styles.imageWrapper}>
                            <img src={q.imagePath} alt="Question Image" className={styles.questionImage} />
                          </div>
                        )}
                    </div>
                    <div className={styles.actions}>
                        <Link href={`/aitools/descriptive/edit/${q.id}`} className={styles.editButton}>
                            수정
                        </Link>
                        <button
                            className={styles.deleteButton}
                            onClick={async () => {
                                if (window.confirm("정말로 이 문제를 삭제하시겠습니까?")) {
                                    try {
                                        await deleteDescriptiveTest(q.id, userInfo);
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

export default DescriptiveTestCardList;