import { NextResponse } from 'next/server'
import { getMarketViewStats, recordMarketView } from '@/lib/market-views'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 120) : ''
}

function cleanGroupId(value: unknown) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const marketId = cleanText(body.marketId)
    const marketName = cleanText(body.marketName)
    const groupId = cleanGroupId(body.groupId)
    const groupName = cleanText(body.groupName) || 'ไม่ระบุประเภท'

    if (!marketId || !marketName) {
      return NextResponse.json({ success: false, error: 'Missing market data' }, { status: 400 })
    }

    const stats = await recordMarketView({ marketId, marketName, groupId, groupName })
    return NextResponse.json({ success: true, data: stats }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketId = cleanText(searchParams.get('marketId'))
  const marketName = cleanText(searchParams.get('marketName')) || marketId
  const groupId = cleanGroupId(searchParams.get('groupId'))
  const groupName = cleanText(searchParams.get('groupName')) || 'ไม่ระบุประเภท'

  if (!marketId) {
    return NextResponse.json({ success: false, error: 'Missing marketId' }, { status: 400 })
  }

  const stats = await getMarketViewStats({ marketId, marketName, groupId, groupName })
  return NextResponse.json({ success: true, data: stats }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}
