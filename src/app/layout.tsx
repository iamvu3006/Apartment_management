import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Da Nang Apartments & Rooms for Rent | Vu Real Estate",
  description:
    "Verified long-term and short-term apartment rentals, studio apartments, and rooms for expats and digital nomads in Da Nang. Real photos & transparent pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={beVietnamPro.variable}>
      <body className={`${beVietnamPro.className} antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-sky-500 selection:text-white`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
