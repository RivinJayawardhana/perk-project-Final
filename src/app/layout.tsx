import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "VentureNext - Exclusive Perks for Ambitious Founders",
  description: "Discover exclusive deals, discounts, and perks designed for founders and startup teams.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "VentureNext - Exclusive Perks for Ambitious Founders",
    description: "Discover exclusive deals, discounts, and perks designed for founders and startup teams.",
    url: "https://venturenext.io",
    type: "website",
    siteName: "VentureNext",
    images: [
      {
        url: "https://venturenext.io/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VentureNext - Exclusive Perks for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureNext - Exclusive Perks for Ambitious Founders",
    description: "Discover exclusive deals, discounts, and perks designed for founders and startup teams.",
    images: ["https://venturenext.io/og-image.jpg"],
  },
  alternates: {
    canonical: "https://venturenext.io",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
