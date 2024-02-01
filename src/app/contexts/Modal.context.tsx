"use client";

import { createContext, useContext, useState } from "react";
import ModalContainer from "@/app/components/modal-container";

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

  const containerClickHandler = () => {
    if (closable) hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {content && (
        <ModalContainer onContainerClick={containerClickHandler}>
          {content}
        </ModalContainer>
      )}
      {children}
    </ModalContext.Provider>
  );
}
