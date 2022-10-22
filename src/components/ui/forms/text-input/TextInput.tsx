type Props = {
  label?: string;
  autoFocus?: boolean;
  handleClick?: React.MouseEventHandler<HTMLInputElement>;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  defaultValue?: string;
  placeHolder?: string;
};

function TextInput({
  label,
  handleChange,
  autoFocus,
  value,
  placeHolder,
  defaultValue,
}: Props) {
  return (
    <div className="form-control mb-4 w-full max-w-xs">
      {label && (
        <label className="label">
          <span className="label-text text-xs font-extrabold uppercase text-white">
            {label}
          </span>
        </label>
      )}
      <input
        onChange={handleChange}
        autoFocus={autoFocus}
        type="text"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeHolder}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
}

export default TextInput;
