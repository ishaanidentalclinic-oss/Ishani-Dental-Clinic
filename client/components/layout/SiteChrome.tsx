"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFab } from "@/components/layout/WhatsappFab";

/**
 * The admin portal (/admin/*) is a separate application living inside this
 * same Next.js project — it gets none of the public site's nav, footer, or
 * WhatsApp FAB, just its own dashboard chrome (see app/admin/layout.tsx).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
