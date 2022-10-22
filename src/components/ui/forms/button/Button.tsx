type Props = {
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  extraClass?: string;
  children: React.ReactElement | string;
  loading?: boolean;
};

function Button({ handleClick, extraClass, children, loading }: Props) {
  return (
    <button
      onClick={handleClick}
      className={`btn !h-max !min-h-[unset] !py-2  px-2 ${extraClass} ${
        loading ? "loading" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
