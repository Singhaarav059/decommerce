import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SceneHost } from "@/components/scene/SceneHost";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-stone-50 focus:translate-y-0"
      >
        Skip to content
      </a>
      <SceneHost>
        <Header />
        {children}
        <Footer />
      </SceneHost>
    </>
  );
}
