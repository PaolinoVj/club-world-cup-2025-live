import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NBA Playoff 2025",
  description: "Countdown e risultati aggiornati in tempo reale",
  icons: {
    icon: "/favicon_nba.svg",
  },
  openGraph: {
    title: "NBA Playoff 2025",
    description: "Segui i Playoff NBA 2025 in tempo reale: countdown, risultati e calendario.",
    url: "https://nba-playoff-live.vercel.app",
    siteName: "NBA Playoff Live",
    images: [
      {
        url: "/og-image.jpg", // Assicurati che og-image.jpg sia in /public
        width: 1200,
        height: 630,
        alt: "Logo NBA Playoff",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NBA Playoff 2025",
    description: "Segui i Playoff NBA 2025 in tempo reale: countdown, risultati e calendario.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
