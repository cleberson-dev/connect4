import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Input from "@/shared/components/input";

test("render successfully", () => {
  render(<Input />);
  expect(screen.findByTestId("input"));
});
