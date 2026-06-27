import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_REVALIDATE_SECONDS, fetchLotteryByDate, todayBangkok } from '@/lib/lottery-api'
import { isLang } from '@/lib/i18n'

export const revalidate = 60

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || todayBangkok()
  const langParam = searchParams.get('lang')
  const lang = isLang(langParam) ? langParam : 'th'
  try {
    return NextResponse.json(await fetchLotteryByDate(date, lang), {
      headers: {
        'Cache-Control': `public, s-maxage=${DEFAULT_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
