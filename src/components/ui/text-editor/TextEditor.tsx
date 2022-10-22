import { useState } from "react";
import "react-quill/dist/quill.snow.css";

type Props = {
  handleChange?: (e: string) => void;
  initialValue?: string;
};

function TextEditor({ initialValue = "", handleChange }: Props) {
  const [value, setValue] = useState(initialValue);

  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;

  function handleEditorChange(e: string) {
    setValue(e);

    if (!handleChange) return;

    handleChange(e);
  }

  return (
    <ReactQuill
      className="rounded-lg"
      theme="snow"
      value={value}
      onChange={(e: string) => handleEditorChange(e)}
    />
  );
}

export default TextEditor;
