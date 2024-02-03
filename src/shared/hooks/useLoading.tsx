import { useState } from "react";
import { useModal } from "@/shared/contexts/Modal.context";
import LoadingModal from "@/shared/modals/loading.modal";

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  return {
    isLoading,
    showLoading: () => {
      modal.showModal(<LoadingModal />);
      setIsLoading(true);
    },
    hideLoading: () => {
      modal.hideModal();
      setIsLoading(false);
    },
  };
}
