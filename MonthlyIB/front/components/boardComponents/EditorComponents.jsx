import { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";



var Font = Quill.import("formats/font");
Font.whitelist = ["default","Roboto", "gothic_a1", "nanum_pen_script", "Nanum_Gothic", "bokor"];
Quill.register(Font, true);

const EditorComponents = ({ styleName, content, setContent }) => {

  
  const modules = useMemo(
    () => ({
      toolbar: [
        [
          {
            font: Font.whitelist
          },
        ],
        [{ header: "1" }, { header: "2" }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "font", // 폰트 선택 추가
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
    "video",
  ];

  return (
    <ReactQuill
      theme="snow"
      className={styleName}
      modules={modules}
      formats={formats}
      value={content}
      onChange={setContent}
    />
  );
};

export default EditorComponents;
