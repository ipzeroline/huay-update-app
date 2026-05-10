import type { MetadataRoute } from 'next'
import { siteDescription, siteName } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: 'ตรวจหวย',
    description: siteDescription,
    start_url: '/th',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#080810',
    theme_color: '#080810',
    icons: [
      {
        src: '/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
