import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GameContextProvider from "@/app/contexts/Game.context";
import ModalContextProvider from "./contexts/Modal.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <ModalContextProvider>
          <GameContextProvider>
            <body className={inter.className}>{children}</body>
          </GameContextProvider>
        </ModalContextProvider>
      </QueryClientProvider>
    </html>
  );
}
