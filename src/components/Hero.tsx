"use client";
// src/components/Hero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="bg-gray-900 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        {/* Kleiner Text über der Hauptüberschrift */}
        <span className="inline-block bg-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Find the best brokers
        </span>

        {/* Hauptüberschrift */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Unlock Your Trading Potential
        </h1>

        {/* Untertitel */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Find the best online brokers and trading platforms for your needs.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg" className="bg-[#145588] hover:bg-[#0e3e66]">
            <Link href="/search-results">Top Brokers</Link>
          </Button>
          {/* Angepasster Button */}
          <Button asChild size="lg" className="bg-[#703d98] text-white hover:bg-[#5a317d]">
            <Link href="/trading-guides">Trading Guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}