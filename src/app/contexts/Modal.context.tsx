"use client";

import {
  MouseEventHandler,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type ModalContextValues = {
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextValues>({
  showModal: () => {},
  hideModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export default function ModalContextProvider({
  children,
}: React.PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const showModal = (newContent: React.ReactNode) => setContent(newContent);
  const hideModal = () => setContent(null);

  const containerClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {content && (
        <div
          ref={containerRef}
          onClick={containerClickHandler}
          className="z-50 fixed w-full h-full flex flex-col items-center justify-center"
        >
          {content}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
