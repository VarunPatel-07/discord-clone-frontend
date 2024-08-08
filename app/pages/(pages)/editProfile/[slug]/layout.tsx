import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Discord | Edit Profile",
    description: "",
  };
}
export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
