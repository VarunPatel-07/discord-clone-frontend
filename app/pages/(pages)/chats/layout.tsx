import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | One-on-One Chat with Friends",
    description:
      "Experience effortless one-on-one communication with your friends on Discord. Engage in private conversations, share moments, and stay connected like never before.",
  };
}
export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
