import Board from "./components/board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-black">Connect 4</h1>
      <Board />
    </main>
  );
}
