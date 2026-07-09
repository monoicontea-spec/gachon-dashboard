"use client";

import type { ReactNode } from "react";

interface NewTabLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function NewTabLink({ href, className, children }: NewTabLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      {children}
    </a>
  );
}
