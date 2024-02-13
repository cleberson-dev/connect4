import { render, screen } from "@testing-library/react";
import SpectatorsCounter from "../spectators-counter";
import { describe, expect, test } from "vitest";

describe("<SpectatorsCounter />", () => {
  test("should render successfully", () => {
    render(<SpectatorsCounter spectators={[]} />);
    expect(screen.getByTitle(/spectators/i)).toBeDefined();
  });
});
