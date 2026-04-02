"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: Props) {
  const pathname = usePathname();
  const isAdminShellRoute =
    pathname?.startsWith("/admin") || 
    pathname === "/login" || 
    pathname === "/bitcoin-school/check-in";

  if (isAdminShellRoute) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

