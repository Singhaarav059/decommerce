import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LensTransition } from "@/components/motion/LensTransition";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="skip-to-content"
      >
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
      <LensTransition />
    </>
  );
}
