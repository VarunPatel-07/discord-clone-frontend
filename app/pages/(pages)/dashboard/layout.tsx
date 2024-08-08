import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | Dashboard",
    description: "",
  };
}
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
