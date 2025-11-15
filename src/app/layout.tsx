import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心情小屋 - 情绪记录与AI陪伴",
  description: "一个温暖治愈的情绪记录应用，集成Kimi AI智能回复，帮助你更好地了解和管理自己的情绪",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
