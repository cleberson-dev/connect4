import { expect, test, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Player } from "@/shared/types";
import Piece from "@/shared/components/piece";

const ROLE_NAME = "board-piece";

beforeEach(cleanup);

test("render successfully", () => {
  render(<Piece player={Player.ONE} />);
  expect(screen.getByRole(ROLE_NAME)).toBeDefined();
});

test("render different elements for empty and non-empty pieces", () => {
  render(
    <>
      <Piece player={Player.ONE} />
      <Piece player={null} />
    </>
  );

  const [a, b] = screen.getAllByRole(ROLE_NAME);

  expect(a.nodeName).not.toBe(b.nodeName);
});

test("render same element for players one and two", () => {
  render(
    <>
      <Piece player={Player.ONE} />
      <Piece player={Player.TWO} />
    </>
  );

  const [a, b] = screen.getAllByRole(ROLE_NAME);

  expect(a.nodeName).toBe(b.nodeName);
});

test("should call onClick event on click", async () => {
  const mock = vi.fn();

  render(<Piece player={Player.ONE} onClick={mock} />);
  await userEvent.click(screen.getByRole(ROLE_NAME));

  expect(mock).toHaveBeenCalledOnce();
});
