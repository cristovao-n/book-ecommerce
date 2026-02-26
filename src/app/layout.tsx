import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";
import { SimpleBreadcrumb } from "../components/breadcrumb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header></Header>
        <div className="ml-4">
          <SimpleBreadcrumb />
        </div>
        {children}
      </body>
    </html>
  );
}
