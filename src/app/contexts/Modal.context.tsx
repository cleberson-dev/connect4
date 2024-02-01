"use client";

import {
  MouseEventHandler,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type Options = {
  closable?: boolean;
};

type ModalContextValues = {
  showModal: (content: React.ReactNode, options?: Options) => void;
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
  const [closable, setClosable] = useState(true);

  const showModal = (
    newContent: React.ReactNode,
    options: Options = { closable: true }
  ) => {
    setContent(newContent);
    setClosable(!!options.closable);
  };
  const hideModal = () => setContent(null);

  const containerClickHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (closable && e.target === e.currentTarget) hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {content && (
        <div
          className="z-50 fixed w-full h-full flex flex-col items-center justify-center backdrop-grayscale backdrop-blur-sm"
          ref={containerRef}
          onClick={containerClickHandler}
        >
          {content}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
