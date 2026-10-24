import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-[var(--radius-md)] bg-ink px-4 py-2 text-sm text-studio focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
