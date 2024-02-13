import { render, screen } from "@testing-library/react";
import { beforeAll, expect, test } from "vitest";
import ModalContextProvider, {
  useModal,
} from "@/shared/contexts/Modal.context";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

const CustomConsumer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { showModal, hideModal } = useModal();
  return (
    <button
      onClick={() => {
        if (isOpen) {
          hideModal();
        } else {
          showModal(<></>);
        }

        setIsOpen(!isOpen);
      }}
    >
      Act
    </button>
  );
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <ModalContextProvider>{children}</ModalContextProvider>;
};

const clickTestButton = async () =>
  await userEvent.click(screen.getByText("Act"));

beforeAll(() => {
  render(<CustomConsumer />, { wrapper });
});

test("show modal container after calling showModal", async () => {
  await clickTestButton();
  expect(screen.getByTestId("modal-container"));
});

test("hide modal container after calling hideModal", async () => {
  await clickTestButton();
  expect(screen.queryByTestId("modal-container")).toBeNull();
});
