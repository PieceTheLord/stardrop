import { BottomNav } from "@/components/layout/bottom-nav";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <section>
      {children}
      <BottomNav />
    </section>
  );
}