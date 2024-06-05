"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./IbComponents.module.css";
import Link from "next/link";
import {
  monthlyIBPostItem,
  monthlyIBPostThumbnail,
  monthlyIBPostPDFFile,
  monthlyIBReviseItem,
} from "@/apis/monthlyIbAPI";
import { useUserStore } from "@/store/user";
import { useIBStore } from "@/store/ib";

const IBPost = () => {
  const imageInput = useRef();
  const fileInput = useRef();
  const [title, setTitle] = useState("");
  const [havingFile, setHavingFile] = useState(false);
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { ibDetail, getIBItem, reviseItem } = useIBStore();
  const searchParams = useSearchParams();
  const monthlyIbId = parseInt(searchParams.get("monthlyIbId"));

  useEffect(() => {
    if (monthlyIbId) {
      getIBItem(monthlyIbId, userInfo);
      console.log(ibDetail);
      setTitle(ibDetail?.title);
      setHavingFile(true);
    }
  }, []);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (monthlyIbId) {
        let accessToken = userInfo?.accessToken;
        const res = await reviseItem(monthlyIbId, title, userInfo);
        if (res?.result.status === 200) {
          if (imageInput.current)
            monthlyIBPostThumbnail(
              res?.data.monthlyIbId,
              imageInput.current,
              accessToken
            );
          if (fileInput.current)
            monthlyIBPostPDFFile(
              res?.data.monthlyIbId,
              fileInput.current,
              accessToken
            );
          router.push("/ib");
        }
      } else {
        let accessToken = userInfo?.accessToken;
        let res = await monthlyIBPostItem(title, accessToken);
        if (res?.result.status === 200) {
          if (imageInput.current)
            monthlyIBPostThumbnail(
              res?.data.monthlyIbId,
              imageInput.current,
              accessToken
            );
          monthlyIBPostPDFFile(
            res?.data.monthlyIbId,
            fileInput.current,
            accessToken
          );
          router.push("/ib");
        } else alert("잘못된 접근입니다.");
      }
    },
    [title]
  );

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
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
    fileInput.current = changeFileName(e.target.files[0]);
    if (fileInput.current) setHavingFile(true);
  }, []);

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
          </div>
          <div className={styles.write_btn_area}>
            <Link href="/ib" className={styles.cancel}>
              취소
            </Link>
            <button
              className={styles.submit}
              type="submit"
              disabled={title !== "" && havingFile === true ? false : true}
            >
              등록
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default IBPost;
