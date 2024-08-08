import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | Invite Friends ",
    description: "",
  };
}
export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
