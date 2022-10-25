import { useState } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

type Props = {
  handleChange?: (e: string) => void;
  handleBlur?: (e: string) => void;
  initialValue?: string | null;
  toolbar?: boolean;
  theme?: string;
  className?: string;
  placeholder?: string;
};

function TextEditor({
  theme = "snow",
  initialValue = "",
  handleChange,
  placeholder,
  handleBlur,
  className,
}: Props) {
  const [value, setValue] = useState(initialValue);

  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;

  function handleEditorChange(e: string) {
    setValue(e);

    if (!handleChange) return;

    handleChange(e);
  }

  function handleEditorBlur() {
    if (!handleBlur) return;

    handleBlur(value as string);
  }

  return (
    <ReactQuill
      className={`rounded-lg ${className}`}
      theme={theme}
      value={value}
      onBlur={handleEditorBlur}
      placeholder={placeholder || "Insert text"}
      onChange={(e: string) => handleEditorChange(e)}
    />
  );
}

export default TextEditor;
