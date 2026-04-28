"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload, faPenAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./IbDetail.module.css";
import { getMonthlyIbPdfDownloadUrl, monthlyIBGetPublicItem } from "@/apis/monthlyIbAPI";
import { useUserInfo } from "@/store/user";
import Loading from "@/components/Loading";

const IbDetail = ({ monthlyIbId }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      setLoading(true);
      const res = await monthlyIBGetPublicItem(monthlyIbId);
      if (!mounted) return;
      setDetail(res?.data || null);
      setLoading(false);
    };

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [monthlyIbId]);

  const hasMeaningfulContent = useMemo(() => {
    const html = detail?.content || "";
    const stripped = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    return stripped.length > 0 || /<img[\s>]/i.test(html);
  }, [detail?.content]);

  if (loading) {
    return <Loading />;
  }

  if (!detail) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.stateCard}>
          <span>MONTHLY IB</span>
          <h1>월간 IB를 찾을 수 없습니다.</h1>
          <Link href="/ib" className={styles.actionButtonSecondary}>
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const isLegacyPdfOnly = !hasMeaningfulContent && (detail?.pdfFiles?.length || 0) > 0;

  return (
    <main className={styles.detailPage}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span>MONTHLY IB FEATURE</span>
            <h1>{detail.title}</h1>
            <p>
              화면에서 읽기 좋은 아카이브 형식으로 정리했습니다. 필요하면 현재 본문 기준의 PDF도 바로 내려받을 수 있습니다.
            </p>
          </div>

          <div className={styles.actions}>
            <a
              href={getMonthlyIbPdfDownloadUrl(monthlyIbId)}
              target="_blank"
              rel="noreferrer"
              className={styles.actionButton}
            >
              <FontAwesomeIcon icon={faDownload} />
              PDF 다운로드
            </a>
            <Link href="/ib" className={styles.actionButtonSecondary}>
              <FontAwesomeIcon icon={faArrowLeft} />
              목록으로
            </Link>
            {userInfo?.authority === "ADMIN" && (
              <Link href={`/ibwrite?monthlyIbId=${monthlyIbId}`} className={styles.actionButtonSecondary}>
                <FontAwesomeIcon icon={faPenAlt} />
                수정
              </Link>
            )}
          </div>
        </section>

        <article className={styles.card}>
          {detail?.monthlyIbThumbnailUrl && (
            <Image
              src={detail.monthlyIbThumbnailUrl}
              alt={detail.title || "Monthly IB thumbnail"}
              width={1200}
              height={680}
              className={styles.thumbnail}
            />
          )}

          <div className={styles.bodyWrap}>
            {isLegacyPdfOnly && (
              <div className={styles.legacyNotice}>
                <span>LEGACY PDF</span>
                <h2>본문 없이 PDF만 등록된 문서입니다.</h2>
                <p>
                  이 글은 기존 업로드 PDF를 그대로 유지하고 있습니다. 아래 내용은 비어 있으며,
                  PDF 다운로드 버튼으로 원본 문서를 받을 수 있습니다.
                </p>
              </div>
            )}

            <div
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: detail.content || "<p></p>" }}
            />
          </div>
        </article>
      </div>
    </main>
  );
};

export default IbDetail;
