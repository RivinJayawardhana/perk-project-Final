"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Music } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  section: string;
  links: FooterLink[];
}

interface FooterData {
  socialLinks: SocialLink[];
  footerLinks: FooterSection[];
  copyrightText?: string;
  newsletter?: {
    title: string;
    subtitle: string;
  };
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Facebook: <Facebook size={20} />,
  Instagram: <Instagram size={20} />,
  Linkedin: <Linkedin size={20} />,
  Twitter: <Twitter size={20} />,
  Youtube: <Youtube size={20} />,
  TikTok: <Music size={20} />,
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch("/api/footer-content");
        if (res.ok) {
          const data = await res.json();
          setFooterData(data);
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus("error");
      setTimeout(() => setSubscriptionStatus("idle"), 3000);
      return;
    }

    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscriptionStatus("success");
        setEmail("");
        setTimeout(() => setSubscriptionStatus("idle"), 3000);
      } else {
        setSubscriptionStatus("error");
        setTimeout(() => setSubscriptionStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
      setSubscriptionStatus("error");
      setTimeout(() => setSubscriptionStatus("idle"), 3000);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#181c23] text-[#e6e6e6] pt-12 pb-6 px-4 mt-16">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {footerData?.newsletter?.title || "Never Miss a Gift Moment"}
        </h2>
        <div className="text-[#b0b4bb] mb-6">
          {footerData?.newsletter?.subtitle || "Get exclusive offers, new experience alerts, and gifting inspiration delivered to your inbox."}
        </div>
        <form 
          onSubmit={handleNewsletterSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 w-full sm:w-auto px-4 py-3 rounded-lg bg-[#23272f] text-white border border-[#23272f] focus:outline-none focus:ring-2 focus:ring-[#e6b756]"
            disabled={subscribing}
          />
          <button
            type="submit"
            disabled={subscribing}
            className="px-8 py-3 rounded-lg font-semibold text-white whitespace-nowrap bg-[#e6b756] hover:bg-[#f5d488] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscribing ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {subscriptionStatus === "success" && (
          <div className="mt-3 text-green-400 text-sm">✓ Successfully subscribed! Check your email.</div>
        )}
        {subscriptionStatus === "error" && (
          <div className="mt-3 text-red-400 text-sm">✗ Failed to subscribe. Please try again.</div>
        )}
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-[#23272f] my-10"></div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image 
                src="/logo.png" 
                alt="VentureNext Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">
                enture<span className="text-[#e6b756]">Next</span>
              </span>
            </div>
            <p className="text-[#b0b4bb] text-sm">Perks for founders & remote teams.</p>
          </div>

          {/* Dynamic Footer Links */}
          {footerData?.footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-white mb-4">{section.section}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.url} className="text-[#b0b4bb] hover:text-[#e6b756]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-[#23272f] my-8"></div>

      {/* Social & Copyright */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-6 mb-6">
          {/* Dynamic Social Media Icons */}
          <div className="flex gap-4">
            {footerData?.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="w-10 h-10 rounded-full bg-[#e6b756] flex items-center justify-center text-[#1a2233] hover:opacity-80 transition"
                title={link.platform}
              >
                {ICON_MAP[link.icon] || ICON_MAP["Facebook"]}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright & Links */}
        <div className="flex flex-col items-center gap-4 text-xs text-[#b0b4bb]">
          <div>{footerData?.copyrightText || "© 2025 VentureNext. All rights reserved."}</div>
          <div className="flex gap-6 flex-wrap justify-center">
            
          </div>
        </div>
      </div>
    </footer>
  );
}
