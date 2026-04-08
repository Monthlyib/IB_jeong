"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

import styles from "./IbComponents.module.css";
import {
  getMonthlyIbPdfDownloadUrl,
  monthlyIBGetItem,
  monthlyIBPostItem,
  monthlyIBPostThumbnail,
  monthlyIBReviseItem,
} from "@/apis/monthlyIbAPI";
import { useUserInfo } from "@/store/user";

const DynamicIbEditor = dynamic(() => import("@/components/ibComponents/IbEditor"), {
  ssr: false,
});

const EMPTY_EDITOR_HTML = "<p><br></p>";

const IBPost = () => {
  const imageInput = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(EMPTY_EDITOR_HTML);
  const [existingPdfName, setExistingPdfName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { userInfo } = useUserInfo();
  const searchParams = useSearchParams();
  const monthlyIbIdParam = searchParams.get("monthlyIbId");
  const monthlyIbId = monthlyIbIdParam ? Number(monthlyIbIdParam) : null;

  useEffect(() => {
    let mounted = true;

    const loadMonthlyIb = async () => {
      if (!monthlyIbId || !userInfo?.accessToken) return;

      const res = await monthlyIBGetItem(monthlyIbId, userInfo);
      const detail = res?.data;
      if (!mounted || !detail) return;

      setTitle(detail.title || "");
      setContent(detail.content || EMPTY_EDITOR_HTML);
      setExistingPdfName(detail.pdfFiles?.[0]?.fileName || "");
    };

    loadMonthlyIb();

    return () => {
      mounted = false;
    };
  }, [monthlyIbId, userInfo]);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title.trim() || submitting) return;

      try {
        setSubmitting(true);
        const accessToken = userInfo?.accessToken;

        if (monthlyIbId) {
          const res = await monthlyIBReviseItem(monthlyIbId, title, content, userInfo);
          if (res?.result?.status === 200) {
            if (imageInput.current) {
              await monthlyIBPostThumbnail(res?.data?.monthlyIbId, imageInput.current, accessToken);
            }
            router.push(`/ib/${monthlyIbId}`);
            return;
          }
        } else {
          const res = await monthlyIBPostItem(title, content, accessToken);
          if (res?.result?.status === 200) {
            if (imageInput.current) {
              await monthlyIBPostThumbnail(res?.data?.monthlyIbId, imageInput.current, accessToken);
            }
            router.push(`/ib/${res?.data?.monthlyIbId}`);
            return;
          }
        }

        alert("월간 IB 저장에 실패했습니다.");
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.message || "월간 IB 저장에 실패했습니다.");
      } finally {
        setSubmitting(false);
      }
    },
    [content, monthlyIbId, router, submitting, title, userInfo]
  );

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onClickImageUpload = (e) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;
    imageInput.current = targetFile;
  };

  return (
    <main className="width_content">
      <form onSubmit={onSubmitForm}>
        <div className={styles.write_wrap}>
          <input
            type="text"
            value={title}
            onChange={onChangeTitle}
            className={styles.write_tit}
            placeholder="월간 IB 제목을 입력하세요!"
          />
          <DynamicIbEditor content={content} setContent={setContent} userInfo={userInfo} />
        </div>

        <div className={styles.write_block}>
          <label>썸네일 등록 ( jpg, png, gif 파일 )</label>
          <input
            type="file"
            name="image"
            accept="image/jpg,image/png,image/jpeg,image/gif"
            className={styles.write_img}
            onChange={onClickImageUpload}
          />
        </div>

        {monthlyIbId && (
          <div className={styles.write_block}>
            <label>PDF 다운로드</label>
            <div className={styles.write_file_meta}>
              <span>
                {existingPdfName
                  ? `기존 PDF가 있으면 그대로 내려받고, 본문이 있으면 최신 본문 기준으로 PDF를 생성합니다. (${existingPdfName})`
                  : "현재 저장된 본문 기준으로 PDF를 생성해 내려받습니다."}
              </span>
              <a
                href={getMonthlyIbPdfDownloadUrl(monthlyIbId)}
                target="_blank"
                rel="noreferrer"
                className={styles.download_pdf_button}
              >
                PDF 다운로드
              </a>
            </div>
          </div>
        )}

        <div className={styles.write_btn_area}>
          <Link href="/ib" className={styles.cancel}>
            취소
          </Link>
          <button className={styles.submit} type="submit" disabled={title.trim() === "" || submitting}>
            {submitting ? "저장 중..." : monthlyIbId ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default IBPost;
