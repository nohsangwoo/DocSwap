import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SEO Info Extractor | Quick Website Analysis Tool",
  description: "Instantly analyze and extract SEO information from any website. Get insights on meta tags, keywords, and more.",
  keywords: [
    "SEO analyzer, website analysis tool, meta tag extractor",
    "SEO information tool, website SEO checker, online SEO audit",
    "keyword density analyzer, title tag analyzer, description analyzer",
    "robots.txt checker, sitemap analyzer, header tag analyzer",
    "SEO performance tool, website optimization helper, SEO data extractor"
  ].join(", "),
  openGraph: {
    title: "SEO Info Extractor - Instant Website Analysis",
    description: "Extract crucial SEO data from any website in seconds. Improve your site's search engine performance.",
    images: [
      {
        url: "https://docswap.ludgi.ai/logo.webp",
        width: 1200,
        height: 630,
        alt: "SEO Info Extractor Tool",
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "SEO Info Extractor",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Info Extractor - Quick Website SEO Analysis",
    description: "Analyze any website's SEO elements instantly. Optimize your online presence with data-driven insights.",
    images: ["https://seo-extractor.example.com/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },


};

const pubId = "ca-pub-5823741955283998"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={pubId} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Funding Choices 스크립트 */}
        <Script
          id="google-funding-choices"
          strategy="afterInteractive"
          src={`https://fundingchoicesmessages.google.com/i/${pubId}?ers=1`}
        />
        {/* Google FC Present 스크립트 */}
        <Script
          id="google-fc-present"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
          }}
        />
      </body>
    </html>
  );
}
