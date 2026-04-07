"use client";

import { useCallback, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MAIL_INLINE_IMAGE_ACCEPT } from "@/apis/mail";

const BaseImage = Quill.import("formats/image");
const MAIL_INLINE_IMAGE_FORMAT = "mail-inline-image";

if (!Quill.imports[`formats/${MAIL_INLINE_IMAGE_FORMAT}`]) {
  class MailInlineImageBlot extends BaseImage {
    static blotName = MAIL_INLINE_IMAGE_FORMAT;
    static tagName = "img";

    static create(value) {
      const node = super.create(value?.src || value);
      if (value?.src) {
        node.setAttribute("src", value.src);
      }
      if (value?.id) {
        node.setAttribute("data-inline-image-id", value.id);
      }
      if (value?.alt) {
        node.setAttribute("alt", value.alt);
      }
      node.setAttribute(
        "style",
        "display:block;max-width:100%;height:auto;margin:16px 0;border-radius:14px;"
      );
      return node;
    }

    static value(node) {
      return {
        src: node.getAttribute("src"),
        id: node.getAttribute("data-inline-image-id"),
        alt: node.getAttribute("alt"),
      };
    }
  }

  Quill.register(MailInlineImageBlot, true);
}

const AdminMailEditor = ({
  value,
  onChange,
  onPrepareInlineImages,
  className,
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const insertInlineImages = useCallback(
    async (files) => {
      if (!files?.length) {
        return;
      }

      const preparedInlineImages = onPrepareInlineImages?.(Array.from(files));
      if (!preparedInlineImages?.length) {
        return;
      }

      const quill = quillRef.current?.getEditor();
      if (!quill) {
        return;
      }

      quill.focus();
      let insertIndex = quill.getSelection(true)?.index ?? quill.getLength();

      preparedInlineImages.forEach((inlineImage) => {
        quill.insertEmbed(
          insertIndex,
          MAIL_INLINE_IMAGE_FORMAT,
          {
            src: inlineImage.previewUrl,
            id: inlineImage.id,
            alt: inlineImage.name,
          },
          "user"
        );
        quill.insertText(insertIndex + 1, "\n", "user");
        insertIndex += 2;
      });

      quill.setSelection(insertIndex, 0, "silent");
    },
    [onPrepareInlineImages]
  );

  const handleToolbarImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleToolbarImage,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [handleToolbarImage]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "blockquote",
      "link",
      MAIL_INLINE_IMAGE_FORMAT,
      "image",
    ],
    []
  );

  const handleDrop = useCallback(
    async (event) => {
      const droppedFiles = Array.from(event.dataTransfer?.files || []);
      const imageFiles = droppedFiles.filter((file) =>
        file.type?.startsWith("image/")
      );
      if (imageFiles.length === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      await insertInlineImages(imageFiles);
    },
    [insertInlineImages]
  );

  const handlePaste = useCallback(
    async (event) => {
      const pastedFiles = Array.from(event.clipboardData?.files || []);
      const imageFiles = pastedFiles.filter((file) =>
        file.type?.startsWith("image/")
      );
      if (imageFiles.length === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      await insertInlineImages(imageFiles);
    },
    [insertInlineImages]
  );

  return (
    <div className={className} onDrop={handleDrop} onPaste={handlePaste}>
      <input
        ref={fileInputRef}
        type="file"
        accept={MAIL_INLINE_IMAGE_ACCEPT}
        multiple
        style={{ display: "none" }}
        onChange={async (event) => {
          const nextFiles = Array.from(event.target.files || []);
          await insertInlineImages(nextFiles);
          event.target.value = "";
        }}
      />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default AdminMailEditor;
