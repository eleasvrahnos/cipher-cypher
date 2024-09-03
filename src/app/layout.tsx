// layout.tsx - Provides the root layout for all pages of the site

// IMPORTS - Metadata, Inter, Global CSS file
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserContext/UserContext";
import { GoogleTagManager } from '@next/third-parties/google';

// Default Next.js font
const inter = Inter({ subsets: ["latin"] });

// Provides Metadata to the site
export const metadata: Metadata = {
  title: "Cipher Cypher",
  description:
    "Cipher Cypher is a challenging series of over 50 visual puzzles that test your mental acuity using math, cryptography, trivia, and wit. Can you solve them all?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      
      <html lang="en">
        <GoogleTagManager gtmId="G-CPYV3YMKFY" />
        <body className={inter.className}>{children}</body>
      </html>
    </UserProvider>
  );
}
