import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quản lý phòng cho thuê",
  description: "Danh sách phòng trọ/căn hộ cho thuê tại Đà Nẵng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased bg-stone-50 text-stone-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
