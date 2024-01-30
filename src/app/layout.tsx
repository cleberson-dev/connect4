import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import ModalContextProvider from "@/app/contexts/Modal.context";
import GameContextProvider from "@/app/contexts/Game.context";
import QueryProvider from "@/app/providers/query.provider";

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
      <ModalContextProvider>
        <GameContextProvider>
          <QueryProvider>
            <body className={inter.className}>{children}</body>
          </QueryProvider>
        </GameContextProvider>
      </ModalContextProvider>

      <ToastContainer />
    </html>
  );
}
