import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Kanit, Sarabun } from 'next/font/google'
import './globals.css'
import AddToHomeScreen from './add-to-home-screen'
import SiteFooter from './site-footer'
import { getSiteUrl } from '@/lib/site-url'
import { baseOpenGraph, baseTwitter, siteDescription, siteName, siteTitle } from '@/lib/seo'

const GOOGLE_ANALYTICS_ID = 'G-BSRB6SK1PD'
const siteUrl = getSiteUrl().replace(/\/$/, '')

// ── next/font: self-hosted, zero FOIT, better LCP ──
const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-kanit',
})

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

function jsonLdScript(data: Record<string, unknown>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ── WebSite + Sitelinks Search Box ──
  const webSiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    alternateName: 'ตรวจหวย Huay Update',
    url: `${siteUrl}/th`,
    inLanguage: 'th-TH',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/th/lottery/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // ── Organization ──
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: `${siteUrl}/th`,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 1024,
      height: 1024,
    },
    email: 'funmask101@gmail.com',
    description: siteDescription,
  }

  return (
    <html lang="th" className={`${kanit.variable} ${sarabun.variable}`}>
      <head>
        {jsonLdScript(webSiteLd)}
        {jsonLdScript(orgLd)}
      </head>
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
        {/* Monetag In-Page Push */}
        <Script id="monetag-inpage-push" strategy="afterInteractive">
          {`(function(s){s.dataset.zone='11109841',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
      </body>
    </html>
  )
}
