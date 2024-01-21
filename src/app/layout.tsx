import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GameContextProvider from "./contexts/Game.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect 4",
  description: "A classic board game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GameContextProvider>
        <body className={inter.className}>{children}</body>
      </GameContextProvider>
    </html>
  );
}
