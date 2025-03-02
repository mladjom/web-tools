import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from '@/components/AppLayout'
import { Analytics } from '@vercel/analytics/react';

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
    images: ['/images/webtools.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppLayout>
          {children}

        </AppLayout>
        <Analytics />
      </body>
    </html>
  );
}
