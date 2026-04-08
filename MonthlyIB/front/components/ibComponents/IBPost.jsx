"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./IbComponents.module.css";
import Link from "next/link";
import {
  monthlyIBGetItem,
  monthlyIBPostItem,
  monthlyIBPostThumbnail,
  monthlyIBPostPDFFile,
  monthlyIBReviseItem,
} from "@/apis/monthlyIbAPI";
import { useUserInfo } from "@/store/user";

const IBPost = () => {
  const imageInput = useRef();
  const fileInput = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [havingFile, setHavingFile] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [currentPdfName, setCurrentPdfName] = useState("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");
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
      setContent(detail.content || "");
      const existingPdf = detail.pdfFiles?.[0];
      setCurrentPdfUrl(existingPdf?.fileUrl || "");
      setCurrentPdfName(existingPdf?.fileName || "");
      setHavingFile(Boolean(existingPdf?.fileUrl));
    };

    loadMonthlyIb();

    return () => {
      mounted = false;
    };
  }, [monthlyIbId, userInfo]);

  useEffect(() => {
    return () => {
      if (selectedPdfUrl) {
        URL.revokeObjectURL(selectedPdfUrl);
      }
    };
  }, [selectedPdfUrl]);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (monthlyIbId) {
        let accessToken = userInfo?.accessToken;
        const res = await monthlyIBReviseItem(monthlyIbId, title, content, userInfo);
        if (res?.result.status === 200) {
          if (imageInput.current) {
            await monthlyIBPostThumbnail(
              res?.data.monthlyIbId,
              imageInput.current,
              accessToken
            );
          }
          if (fileInput.current) {
            await monthlyIBPostPDFFile(
              res?.data.monthlyIbId,
              fileInput.current,
              accessToken
            );
          }
          router.push("/ib");
        }
      } else {
        let accessToken = userInfo?.accessToken;
        let res = await monthlyIBPostItem(title, content, accessToken);
        if (res?.result.status === 200) {
          if (imageInput.current) {
            await monthlyIBPostThumbnail(
              res?.data.monthlyIbId,
              imageInput.current,
              accessToken
            );
          }
          await monthlyIBPostPDFFile(
            res?.data.monthlyIbId,
            fileInput.current,
            accessToken
          );
          router.push("/ib");
        } else alert("잘못된 접근입니다.");
      }
    },
    [content, monthlyIbId, router, title, userInfo]
  );

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const changeFileName = (file) => {
    const fileExtention = file.name.split(".")[1];
    const oldFileName = file.name.split(".")[0];
    const date = new Date();

    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var timeString = hours + ":" + minutes + ":" + seconds;
    const newFile = new File(
      [file],
      `${oldFileName}_${timeString}.${fileExtention}`,
      {
        type: file.type,
      }
    );
    return newFile;
  };

  const onClickImageUpload = (e) => {
    imageInput.current = changeFileName(e.target.files[0]);
  };

  const onClickFileUpload = useCallback((e) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;

    const renamedFile = changeFileName(targetFile);
    fileInput.current = renamedFile;
    setHavingFile(true);
    setSelectedPdfName(renamedFile.name);
    setSelectedPdfUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(renamedFile);
    });
  }, []);

  const downloadPdfUrl = selectedPdfUrl || currentPdfUrl;
  const downloadPdfName = selectedPdfName || currentPdfName;

  return (
    <>
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
            <textarea
              value={content}
              onChange={onChangeContent}
              className={styles.write_content}
              placeholder="월간 IB 본문을 입력하세요."
            />
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
          <div className={styles.write_block}>
            <label>PDF 업로드 ( pdf 파일 )</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              className={styles.write_file}
              onChange={onClickFileUpload}
            />
            {downloadPdfUrl && (
              <div className={styles.write_file_meta}>
                <span>{downloadPdfName || "등록된 PDF"}</span>
                <a
                  href={downloadPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={downloadPdfName || undefined}
                  className={styles.download_pdf_button}
                >
                  PDF 다운로드
                </a>
              </div>
            )}
          </div>
          <div className={styles.write_btn_area}>
            <Link href="/ib" className={styles.cancel}>
              취소
            </Link>
            <button
              className={styles.submit}
              type="submit"
              disabled={title.trim() === "" || havingFile !== true}
            >
              {monthlyIbId ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default IBPost;
