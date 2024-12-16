import Header from "@/app/(public)/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex  flex-col relative">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
}
