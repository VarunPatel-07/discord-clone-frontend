import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import "./css/font.css";
import { ContextProvider } from "@/context/ContextApi";
import { Toaster } from "@/components/ui/sonner";
import CustomGlobalAlert from "@/components/Model/GlobalModel/CustomGlobalAlert";
const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Discord Clone`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <section className="min-h-screen h-[100vh] overflow-hidden max-h-[100vh] relative">
            <main className="w-full h-full">{children}</main>
            <CustomGlobalAlert />
          </section>
        </ContextProvider>
      </body>
    </html>
  );
}
