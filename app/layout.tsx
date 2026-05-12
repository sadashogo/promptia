import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promptia - AIを遊びながら学ぼう",
  description:
    "Duolingo風にプロンプトの基本を学べる、AI入門アプリ。3分のレッスンを積み重ねて、いつのまにかAIを使いこなせるようになろう。",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 font-sans text-stone-900">
        {children}
      </body>
    </html>
  );
}
