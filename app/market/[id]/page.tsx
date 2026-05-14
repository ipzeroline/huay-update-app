import { permanentRedirect } from 'next/navigation'
import { fetchMarketResults } from '@/lib/lottery-api'
import { localizedMarketPath } from '@/lib/market-url'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function MarketPage({ params }: PageProps) {
  const { id } = await params
  const detail = await fetchMarketResults(id, 'th').catch(() => null)
  const marketName = detail?.data?.market?.name
  permanentRedirect(encodeURI(localizedMarketPath(id, marketName, 'th')))
}
