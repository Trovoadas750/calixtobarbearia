import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Calixto Barbearia - Barbearia em Ourinhos",
  description: "Barbearia em Ourinhos, São Paulo. Conhecido pelo seus freestyles totalmente originais e únicos com um estilo próprio e inconfundível. Agende seu horário e venha conhecer o trabalho do Calixto.  ",
};

export default function RootLayout({ children }) {
  return (
    <>
    <Header />
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
    </>
  );
}
