import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import AddToHomeScreen from './add-to-home-screen'
import SiteFooter from './site-footer'
import { getSiteUrl } from '@/lib/site-url'
import { baseOpenGraph, baseTwitter, siteDescription, siteKeywords, siteName, siteTitle } from '@/lib/seo'

const GOOGLE_ANALYTICS_ID = 'G-BSRB6SK1PD'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: 'lottery',
  keywords: siteKeywords,
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: '/th' },
  openGraph: baseOpenGraph('/th', siteTitle, siteDescription),
  twitter: baseTwitter(siteTitle, siteDescription),
}

export const viewport: Viewport = {
  themeColor: '#080810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        {children}
        <SiteFooter />
        <AddToHomeScreen />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
