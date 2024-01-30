import { useState } from "react";
import { useModal } from "@/app/contexts/Modal.context";
import LoadingModal from "@/app/modals/loading.modal";

export default function useLoading() {
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
