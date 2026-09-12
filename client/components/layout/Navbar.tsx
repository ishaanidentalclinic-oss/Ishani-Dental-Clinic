"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useScrolled } from "@/hooks/useScrolled";
import { useHashLinkClick } from "@/hooks/useHashLinkClick";
import { NAV_LINKS } from "@/constants/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const APPOINTMENT_HREF = "/contact#appointment";

export function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const hashClick = useHashLinkClick();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasDarkHero = pathname === "/";
  const solid = !hasDarkHero || scrolled || mobileOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "transition-colors duration-300",
          solid ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="mx-auto grid max-w-(--container-page) grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-8 lg:px-12">
          <Logo className={cn("justify-self-start", solid ? "text-ink-900" : "text-white")} />

          <div
            className={cn(
              "hidden items-center gap-1 justify-self-center rounded-pill px-2 py-2 lg:flex",
              solid ? "bg-sage-50" : "bg-white/95 shadow-sm",
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={hashClick(link.href)}
                className="rounded-pill px-4 py-2 text-sm font-medium whitespace-nowrap text-ink-900 transition-colors hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-self-end gap-2">
            <div className="hidden lg:block">
              <Button href={APPOINTMENT_HREF} onClick={hashClick(APPOINTMENT_HREF)}>
                Book Appointment
              </Button>
            </div>

            <button
              type="button"
              className={cn(
                "-mr-2 flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
                solid ? "text-ink-900" : "text-white",
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-black/5 bg-white px-6 py-6 shadow-lg lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    setMobileOpen(false);
                    hashClick(link.href)?.(event);
                  }}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ink-900 hover:bg-sage-50"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                href={APPOINTMENT_HREF}
                className="mt-3 w-full"
                onClick={(event) => {
                  setMobileOpen(false);
                  hashClick(APPOINTMENT_HREF)?.(event);
                }}
              >
                Book Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
