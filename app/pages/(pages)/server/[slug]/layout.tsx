import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | Server",
    description: "",
  };
}
export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
