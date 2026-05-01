import { NextResponse } from 'next/server'
import { fetchMarketResults, isHiddenLotteryMarket } from '@/lib/lottery-api'
import { isLang } from '@/lib/i18n'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request, ctx: RouteContext<'/api/market/[id]'>) {
  const { id } = await ctx.params
  const { searchParams } = new URL(req.url)
  const langParam = searchParams.get('lang')
  const lang = isLang(langParam) ? langParam : 'th'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 20))

  try {
    const detail = await fetchMarketResults(id, lang, { page, limit })
    if (isHiddenLotteryMarket(detail.data?.market)) {
      return NextResponse.json({ success: false, error: 'Market not found' }, { status: 404 })
    }

    return NextResponse.json(detail, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
