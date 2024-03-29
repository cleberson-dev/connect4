import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import ModalContextProvider from "@/shared/contexts/Modal.context";
import QueryProvider from "@/shared/providers/query.provider";

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
      <QueryProvider>
        <body className={inter.className}>
          <ModalContextProvider>{children}</ModalContextProvider>
          <ToastContainer />
        </body>
      </QueryProvider>
    </html>
  );
}
