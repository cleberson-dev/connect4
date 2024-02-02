export const getLabelBasedOnSlotPosition =
  (rowLength: number) => (col: number, row: number) =>
    `${["ABCDEFGHIJKLMNOPQRSTUVWXYZ"[col]]}${rowLength - row}`;
