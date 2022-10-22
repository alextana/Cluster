// Popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useState } from "react";

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

  function handleContentClick() {
    setIsOpen(false);
  }

  return (
    <PopoverPrimitive.Root open={isOpen}>
      <PopoverTrigger onClick={() => setIsOpen(true)}>{trigger}</PopoverTrigger>
      <PopoverContent
        onClick={handleContentClick}
        className="mt-1 overflow-hidden rounded-md border border-white/10 bg-zinc-600/40 shadow-2xl backdrop-blur-md "
      >
        {children}
      </PopoverContent>
    </PopoverPrimitive.Root>
  );
};

// export const Popover = PopoverPrimitive.Root;
// export const PopoverTrigger = PopoverPrimitive.Trigger;
// export const PopoverContent = PopoverPrimitive.Content;
