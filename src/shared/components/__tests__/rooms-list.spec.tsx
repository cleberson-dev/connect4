import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import RoomsList from "@/shared/components/rooms-list";

describe("<RoomsList />", () => {
  beforeEach(cleanup);
  test("should render successfully", () => {
    render(<RoomsList rooms={[]} />);
    expect(screen.getByTestId("rooms-list")).toBeDefined();
  });

  test("should show 'No rooms Available' with 0 items", () => {
    render(<RoomsList rooms={[]} />);
    expect(screen.getByText("No rooms Available")).toBeDefined();
  });

  test("should show a unordered list when there's 1 or more items", () => {
    render(
      <RoomsList
        rooms={[{ id: "1", name: "Room #1", players: 0, spectators: 0 }]}
      />
    );

    const el = screen.getByTestId("rooms-list");
    expect(el.nodeName).toBe("UL");
    expect(el.childElementCount).toBe(1);
  });
});
