import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewebstart.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Web Start — Premium Software Agency",
    template: "%s | The Web Start",
  },
  description:
    "The Web Start is a premium software agency specialising in Full-Stack Development, WordPress, UI/UX Design, SEO, Social Media Marketing, and Branding.",
  keywords: [
    "web development agency",
    "full stack development",
    "WordPress development",
    "UI UX design",
    "SEO agency",
    "branding agency",
    "software agency India",
  ],
  authors: [{ name: "The Web Start", url: siteUrl }],
  creator: "The Web Start",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "The Web Start",
    title: "The Web Start — Premium Software Agency",
    description:
      "Premium digital solutions — Full-Stack Dev, WordPress, UI/UX, SEO, Social Media & Branding.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "The Web Start",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Web Start — Premium Software Agency",
    description:
      "Premium digital solutions — Full-Stack Dev, WordPress, UI/UX, SEO, Social Media & Branding.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#04040a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`}>
      <body className="antialiased bg-[#04040a] text-[#f1f0ff] font-sans">
        <SmoothScroll>
          <MotionProvider>{children}</MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
