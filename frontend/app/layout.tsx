import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="py-3 flex justify-center">
          <div className="flex items-center justify-between w-full max-w-2xl">
            <Link
              className={`font-bold text-indigo-600 hover:text-indigo-700`}
              href="/"
            >
              Home
            </Link>

            <Link
              className={`font-bold text-indigo-600 hover:text-indigo-700`}
              href="/withdraw"
            >
              Withdraw
            </Link>
          </div>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}
