

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./AICoachingRecommend.module.css";
import Loading from "@/components/Loading";
import {fetchRecommendedTopics} from "@/apis/AiIAAPI"; // Adjust the import path as necessary
import { useUserInfo } from "@/store/user";

const AICoachingRecommend = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const topics = await fetchRecommendedTopics(subject, chapter, userInfo);
        setRecommendations(topics);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subject && chapter) fetchRecommendations();
  }, [subject, chapter]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <strong>{subject}</strong> - <strong>{chapter}</strong> 관련 추천 주제
      </h2>
      {loading ? (
        <div className={styles.loading}><Loading /></div>
      ) : recommendations.length === 0 ? (
        <div className={styles.error}>추천할 수 있는 주제가 없습니다.</div>
      ) : (
        recommendations.map((topic, index) => (
          <div key={index} className={styles.topicCard}>
            {topic}
          </div>
        ))
      )}
    </div>
  );
};

export default AICoachingRecommend;