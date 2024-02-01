export const getLabelBasedOnSlotPosition = (col: number, row: number) =>
  `${["ABCDEFGHIJKLMNOPQRSTUVWXYZ"[col]]}${row + 1}`;
