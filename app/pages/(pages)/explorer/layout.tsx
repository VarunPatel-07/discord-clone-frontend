import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | Explorer",
    description: "",
  };
}
export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
