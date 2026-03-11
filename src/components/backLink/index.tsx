"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import React from "react";

export function BackLink({
  href,
  children = "Voltar",
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <ChevronLeft size={16} className="text-slate-500" />
      <span>{children}</span>
    </Link>
  );
}

