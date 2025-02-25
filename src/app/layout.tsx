import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./provider";

export const metadata: Metadata = {
  title: "RGT Front-end Project",
  description: "프론트엔드 면접전 과제 프로젝트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
