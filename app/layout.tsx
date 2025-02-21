import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from '@/components/AppLayout'
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Web Tools | Developer Utilities',
  description: 'Free online tools for web developers including aspect ratio calculator and typography generator.',
  keywords: 'web tools, developer tools, aspect ratio calculator, typography generator',
  openGraph: {
    title: 'Web Tools | Developer Utilities',
    description: 'Free online tools for web developers',
    url: 'https://tools.milentijevic.com/aspectratio',
    images: ['/og-webtools.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppLayout>
          {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        </AppLayout>
        <Analytics />
      </body>
    </html>
  );
}
