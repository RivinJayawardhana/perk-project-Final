"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#1a2233] shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="VentureNext Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
          />
          <span className="text-lg sm:text-xl font-bold text-white">
            enture<span className="text-[#e6b756]">Next</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 xl:gap-8 text-white font-medium">
          <Link href="/" className="hover:text-[#e6b756] transition-colors">Home</Link>
          <Link href="/perks" className="hover:text-[#e6b756] transition-colors">Perks</Link>
          <Link href="/about" className="hover:text-[#e6b756] transition-colors">About</Link>
          <Link href="/partner" className="hover:text-[#e6b756] transition-colors">Partner</Link>
          <Link href="/journal" className="hover:text-[#e6b756] transition-colors">Journal</Link>
          <Link href="/contact" className="hover:text-[#e6b756] transition-colors">Contact</Link>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link href="/perks">
            <button className="bg-[#e6b756] text-[#1a2233] font-semibold px-6 py-2 rounded-full hover:bg-[#f5d488] transition-colors">
              Explore Perks
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 hover:bg-[#232b3b] rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 z-30 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-40 bg-[#1a2233] shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col px-4 sm:px-6 py-4 gap-2">
              <Link 
                href="/" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/perks" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Perks
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/partner" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Partner
              </Link>
              <Link 
                href="/journal" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Journal
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-[#e6b756] hover:bg-[#232b3b] transition-colors py-3 px-4 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <hr className="border-[#232b3b] my-2" />
              <Link 
                href="/perks"
                onClick={() => setIsOpen(false)}
              >
                <button className="bg-[#e6b756] text-[#1a2233] font-semibold px-6 py-3 rounded-full hover:bg-[#f5d488] transition-colors w-full">
                  Explore Perks
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
