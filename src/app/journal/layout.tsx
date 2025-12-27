import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://venturenext.io/journal",
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
