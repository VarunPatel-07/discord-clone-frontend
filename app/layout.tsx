import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import "./css/font.css";
import { ContextProvider } from "@/context/ContextApi";
import "react-tooltip/dist/react-tooltip.css";
import GlobalSuccessNotification from "@/components/Model/GlobalModel/GlobalSuccessNotification";
import TootlrTipRenderer from "@/components/TootlrTipRenderer";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/components/Sidebar";
const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "",
    description: "",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ContextProvider>
          <NextTopLoader
            color="#2299DD"
            height={4}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={600}
            zIndex={999999}
          />
          <main className="min-h-screen h-[100vh]  max-h-[100vh] relative overflow-hidden">
            <GlobalSuccessNotification />
            <section className="w-full h-full">{children}</section>
            <TootlrTipRenderer />
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
