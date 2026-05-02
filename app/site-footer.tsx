import Image from 'next/image'
import Link from 'next/link'
import { lotteryGroups, siteDescription, siteName } from '@/lib/seo'

const policyLinks = [
  { href: '/th', label: 'หน้าแรก' },
  { href: '/th/lottery-formula', label: 'สูตรคำนวณหวย' },
  { href: '/sitemap.xml', label: 'Sitemap' },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/th" className="site-footer-logo" aria-label={siteName}>
            <Image src="/logo.png" alt="" width={40} height={40} />
            <span>{siteName}</span>
          </Link>
          <p>{siteDescription}</p>
          <p className="site-footer-note">
            ข้อมูลผลรางวัลใช้เพื่อการตรวจสอบและอ้างอิงเท่านั้น กรุณาตรวจสอบกับแหล่งประกาศผลอย่างเป็นทางการอีกครั้ง
          </p>
        </div>

        <nav className="site-footer-nav" aria-label="ประเภทหวย">
          <h2>ประเภทหวย</h2>
          <div>
            {lotteryGroups.map(group => (
              <Link key={group.code} href={`/th/lottery/group/${group.code}`}>
                {group.name}
              </Link>
            ))}
          </div>
        </nav>

        <nav className="site-footer-nav" aria-label="ข้อมูลเว็บไซต์">
          <h2>ข้อมูลเว็บไซต์</h2>
          <div>
            {policyLinks.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} {siteName}. All rights reserved.</span>
        <span>huayupdate.live</span>
      </div>
    </footer>
  )
}
