import Sidebar from "@/components/Sidebar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[100%] h-[100%] flex items-stretch justify-start">
      <div className="w-[15%] min-w-[72px] max-w-[72px] transition-all">
        <Sidebar />
      </div>
      <div className="w-[100%] transition-all">{children}</div>
    </div>
  );
}
