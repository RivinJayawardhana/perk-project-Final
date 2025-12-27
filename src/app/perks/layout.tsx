import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://venturenext.io/perks",
  },
};

export default function PerksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
