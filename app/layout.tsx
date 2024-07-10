import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import "./css/font.css";
import { ContextProvider } from "@/context/ContextApi";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Discord Clone`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
