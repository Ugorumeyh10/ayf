"use client";

import { usePathname } from "next/navigation";

export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/members")) return null;
  return <>{children}</>;
}
