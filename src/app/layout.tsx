import type React from "react";
import ClientLayout from "./client-layout";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <NextTopLoader />
      {children}
    </ClientLayout>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fintrack",
};
