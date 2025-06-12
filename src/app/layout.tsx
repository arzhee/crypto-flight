
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans } from 'next/font/google';

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans', // CSS variable name
});

export const metadata: Metadata = {
  title: 'Crypto Flight - Your Guide to Cryptocurrency',
  description: 'Learn the basics of cryptocurrency with an interactive checklist designed for beginners.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pt_sans.variable}`}>
      <head>
        {/* Google Font links are removed as next/font will handle it */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
