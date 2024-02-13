import { beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Board from "@/shared/components/board";
import { Player } from "@/shared/types";
import { createFreshSlots } from "@/shared/utils";

beforeEach(cleanup);

test("render successfully", () => {
  render(<Board slots={[]} player={Player.ONE} />);
  expect(screen.getByTestId("board")).toBeDefined();
});

test("call onColumnClick when one of the columns is clicked", async () => {
  const mock = vi.fn();
  render(
    <Board
      slots={createFreshSlots()}
      player={Player.ONE}
      onColumnClick={mock}
      playable
    />
  );
  await userEvent.click(screen.getByTestId("board").querySelector("div")!);
  expect(mock).toHaveBeenCalledOnce();
});

test("not call onColumnClick for not playable boards when one of the columns is clicked", async () => {
  const mock = vi.fn();
  render(
    <Board
      slots={createFreshSlots()}
      player={Player.ONE}
      onColumnClick={mock}
      playable={false}
    />
  );
  await userEvent.click(screen.getByTestId("board").querySelector("div")!);
  expect(mock).toHaveBeenCalledOnce();
});
