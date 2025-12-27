"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogPost() {
  const params = useParams();
  const id = params?.id as string | undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white border-b">
        <div className="text-2xl font-bold text-gray-900">VentureNext</div>
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/perks" className="text-gray-600 hover:text-gray-900">Perks</Link>
          <Link href="/partner" className="text-gray-600 hover:text-gray-900">Partner</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
        </div>
        <Button>Get Started</Button>
      </nav>

      {/* Article */}
      <article className="px-6 py-12 max-w-3xl mx-auto">
        <Link href="/journal" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Back to Journal
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post {id}</h1>
        <p className="text-gray-600 mb-8">Loading article content...</p>
      </article>
    </div>
  );
}
