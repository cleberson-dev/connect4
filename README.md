# Connect 4

- A Next.js application for a classic board game called "Connect 4"

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirements

- Players take turns placing pieces on a vertical board
- The board is 7x6
- Each player has its own color (initial should be yellow and blue, but later can be customizable)
- The first player to get four pieces in a horizontal, vertical or diagonal line wins.
- Since the board is vertical, parts inserted in a certain column will always fall in the lowest unoccupied row in that column.
- As soon as a column contains six pieces, it is full, and no further pieces can be placed.
- If all the rows are full and neither player has four pieces in a row, the game is a tie.
- Should be able to rematch.
- It should count each players wins and ties.

## Further Features

- An online game, be able to play against each other through internet.
- Create a room, where other players can join in and watch the game.
- Room Queue, where players in line will have their opportunity to play as well.
- Creata an option to only watch, or to join to play as well.
