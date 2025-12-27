import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://venturenext.io/partner",
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
