import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import ModalContainer from "@/shared/components/modal-container";

beforeEach(cleanup);

test("render successfully", () => {
  render(<ModalContainer content={<></>} />);
  expect(screen.getByTestId("modal-container")).toBeDefined();
});

test("not render if there's no content", async () => {
  render(<ModalContainer content={null} />);
  expect(screen.queryByTestId("modal-container")).toBeNull();
});
