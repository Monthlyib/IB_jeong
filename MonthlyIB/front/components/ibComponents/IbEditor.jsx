"use client";

import { useCallback, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

import styles from "./IbEditor.module.css";
import { monthlyIBUploadContentImage } from "@/apis/monthlyIbAPI";

const Font = Quill.import("formats/font");
Font.whitelist = [
  "default",
  "Roboto",
  "gothic_a1",
  "nanum_pen_script",
  "Nanum_Gothic",
  "bokor",
];
Quill.register(Font, true);

const IbEditor = ({ content, setContent, userInfo }) => {
  const quillRef = useRef(null);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const res = await monthlyIBUploadContentImage(file, userInfo?.accessToken);
        const imageUrl = res?.data?.imageUrl;
        if (!imageUrl) {
          throw new Error("이미지 업로드에 실패했습니다.");
        }

        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection(true) || {
          index: editor.getLength(),
          length: 0,
        };

        editor.insertEmbed(range.index, "image", imageUrl, "user");
        editor.setSelection(range.index + 1, 0, "silent");
      } catch (error) {
        console.error(error);
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "이미지 업로드에 실패했습니다."
        );
      }
    };
  }, [userInfo?.accessToken]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: Font.whitelist }],
          [{ header: "1" }, { header: "2" }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [handleImageUpload]
  );

  const formats = [
    "font",
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
  ];

  return (
    <div className={styles.editorShell}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        className={styles.editorFrame}
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
      />
      <p className={styles.uploadHint}>
        툴바의 이미지 버튼으로 본문 이미지를 업로드해 삽입할 수 있습니다.
      </p>
    </div>
  );
};

export default IbEditor;
