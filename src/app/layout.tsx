import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phòng Trọ & Căn Hộ Cho Thuê Đà Nẵng | Vũ Real Estate",
  description:
    "Hệ thống phòng trọ, căn hộ mini, studio cho thuê chính chủ & tư vấn uy tín tại Đà Nẵng. Hình ảnh thực tế, thông tin minh bạch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={`${beVietnamPro.className} antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-sky-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
