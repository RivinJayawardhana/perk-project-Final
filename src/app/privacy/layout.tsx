import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://venturenext.io/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
