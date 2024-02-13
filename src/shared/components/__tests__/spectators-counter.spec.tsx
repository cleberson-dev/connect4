import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import SpectatorsCounter from "@/shared/components/spectators-counter";

test("render successfully", () => {
  render(<SpectatorsCounter spectators={[]} />);
  expect(screen.getByTitle(/spectators/i)).toBeDefined();
});
