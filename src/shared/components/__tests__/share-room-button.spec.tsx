import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ShareRoomButton from "@/shared/components/share-room-button";

test("render successfully", () => {
  render(<ShareRoomButton onClick={() => {}} />);
  expect(screen.getByTitle(/share room/i)).toBeDefined();
});
