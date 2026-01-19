'use client';

import Link from 'next/link';

interface NavbarProps {
    showBackLink?: boolean;
}

export default function Navbar({ showBackLink = false }: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold tracking-widest uppercase hover:opacity-70 transition">
                        Culture Circle
                    </Link>
                    <span className="hidden md:block h-4 w-[1px] bg-gray-300"></span>
                    <span className="hidden md:block text-sm font-serif italic text-gray-500">AI Stylist</span>
                </div>

               
            </div>
        </header>
    );
}
