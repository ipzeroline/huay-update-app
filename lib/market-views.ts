import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export type MarketViewStats = {
  marketId: string
  marketName: string
  groupId: number | null
  groupName: string
  totalViews: number
  todayViews: number
  updatedAt: string | null
}

type MarketViewRecord = {
  marketId: string
  marketName: string
  groupId: number | null
  groupName: string
  totalViews: number
  daily: Record<string, number>
  lastViewedAt: string | null
}

type MarketViewFile = {
  group: {
    id: number | null
    name: string
  }
  totalViews: number
  markets: Record<string, MarketViewRecord>
}

type MarketViewInput = {
  marketId: string
  marketName: string
  groupId?: number | null
  groupName?: string | null
}

const viewDir = path.join(process.cwd(), 'data', 'market-views')
const writeLocks = new Map<string, Promise<unknown>>()

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function groupKey(groupId: number | null | undefined, groupName: string | null | undefined) {
  if (Number.isInteger(groupId)) return `group-${groupId}`
  return `group-${(groupName || 'unknown').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'unknown'}`
}

function groupFilePath(groupId: number | null | undefined, groupName: string | null | undefined) {
  return path.join(viewDir, `${groupKey(groupId, groupName)}.json`)
}

async function readViewFile(input: MarketViewInput): Promise<MarketViewFile> {
  const groupId = input.groupId ?? null
  const groupName = input.groupName || 'ไม่ระบุประเภท'
  const filePath = groupFilePath(groupId, groupName)

  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as MarketViewFile
    return {
      group: parsed.group ?? { id: groupId, name: groupName },
      totalViews: parsed.totalViews ?? 0,
      markets: parsed.markets ?? {},
    }
  } catch {
    return {
      group: { id: groupId, name: groupName },
      totalViews: 0,
      markets: {},
    }
  }
}

function statsFromRecord(input: MarketViewInput, record?: MarketViewRecord): MarketViewStats {
  return {
    marketId: input.marketId,
    marketName: record?.marketName ?? input.marketName,
    groupId: record?.groupId ?? input.groupId ?? null,
    groupName: record?.groupName ?? input.groupName ?? 'ไม่ระบุประเภท',
    totalViews: record?.totalViews ?? 0,
    todayViews: record?.daily[todayKey()] ?? 0,
    updatedAt: record?.lastViewedAt ?? null,
  }
}

export async function getMarketViewStats(input: MarketViewInput): Promise<MarketViewStats> {
  const file = await readViewFile(input)
  return statsFromRecord(input, file.markets[input.marketId])
}

export async function recordMarketView(input: MarketViewInput): Promise<MarketViewStats> {
  const groupId = input.groupId ?? null
  const groupName = input.groupName || 'ไม่ระบุประเภท'
  const filePath = groupFilePath(groupId, groupName)
  const previousWrite = writeLocks.get(filePath) ?? Promise.resolve()
  const nextWrite = previousWrite
    .catch(() => undefined)
    .then(async () => {
      const file = await readViewFile({ ...input, groupId, groupName })
      const today = todayKey()
      const now = new Date().toISOString()
      const current = file.markets[input.marketId] ?? {
        marketId: input.marketId,
        marketName: input.marketName,
        groupId,
        groupName,
        totalViews: 0,
        daily: {},
        lastViewedAt: null,
      }

      const nextRecord: MarketViewRecord = {
        ...current,
        marketName: input.marketName,
        groupId,
        groupName,
        totalViews: current.totalViews + 1,
        daily: {
          ...current.daily,
          [today]: (current.daily[today] ?? 0) + 1,
        },
        lastViewedAt: now,
      }
      const nextFile: MarketViewFile = {
        group: { id: groupId, name: groupName },
        totalViews: file.totalViews + 1,
        markets: {
          ...file.markets,
          [input.marketId]: nextRecord,
        },
      }

      await mkdir(viewDir, { recursive: true })
      await writeFile(filePath, `${JSON.stringify(nextFile, null, 2)}\n`, 'utf8')

      return statsFromRecord(input, nextRecord)
    })

  writeLocks.set(filePath, nextWrite)

  try {
    return await nextWrite
  } finally {
    if (writeLocks.get(filePath) === nextWrite) writeLocks.delete(filePath)
  }
}
