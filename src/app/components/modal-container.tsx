import { MouseEventHandler, useRef } from "react";

type ModalContainerProps = {
  children: React.ReactNode;
  onContainerClick?: () => void;
};

export default function ModalContainer({
  children,
  onContainerClick,
}: ModalContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onContainerClick?.();
  };

  return (
    <div
      className="z-50 fixed w-full h-full flex flex-col justify-center items-center backdrop-grayscale backdrop-blur-sm"
      ref={containerRef}
      onClick={containerClickHandler}
    >
      {children}
    </div>
  );
}
