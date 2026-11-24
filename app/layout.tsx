import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Suleet — Mobile Application Developer",
    template: "%s · Muhammad Suleet",
  },
  description:
    "React Native developer building production iOS and Android apps, from first prototype to App Store and Google Play.",
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
