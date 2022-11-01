// Popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useRef, useState } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

export const Popover = ({
  children,
  trigger,
}: {
  children: React.ReactElement;
  trigger: JSX.Element;
}) => {
  const PopoverTrigger = PopoverPrimitive.Trigger;
  const PopoverContent = PopoverPrimitive.Content;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleContentClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setIsOpen(false);
  }

  const ref = useRef(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setIsOpen(true);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <PopoverPrimitive.Root open={isOpen}>
      <PopoverTrigger onClick={(e) => handleClick(e)}>{trigger}</PopoverTrigger>
      <PopoverContent
        ref={ref}
        onClick={(e) => handleContentClick(e)}
        className="z-[300] mt-1 overflow-hidden rounded-md border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-md"
      >
        {children}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};
