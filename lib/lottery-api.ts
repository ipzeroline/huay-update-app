export interface ResultNumber {
  no_result?: boolean
  status?: string
  label?: string
  no_result_reason?: string
  manual_cancelled_all_tickets?: boolean
  first_prize?: string
  last_2_digits?: string
  top_3?: string
  top_2?: string
  bottom_2?: string
}
export interface MarketResult {
  draw_id: number
  draw_date: string
  result_at: string | null
  status: string
  result_number: ResultNumber | null
  result_top_3: string
  result_top_2: string
  result_bottom_2: string
  first_prize: string
  last_2_digits: string
}
export interface Market {
  market_id: number
  market_name: string
  market_logo: string
  market_icon: string
  result: MarketResult | null
}
export interface Group {
  group_id: number
  group_code: string
  group_name: string
  markets: Market[]
}
export interface MarketDetailResponse {
  success: boolean
  data?: {
    market: { id: number; name: string; group_id: number; group_name: string; logo: string; icon: string }
    latest_result: MarketResult | null
    history: MarketResult[]
    pagination?: { page: number; limit: number; count: number; total: number; has_more: boolean }
  }
  message?: string
  error?: string
}
export interface LotteryByDateResponse {
  success: boolean
  data?: {
    draw_date: string
    groups: Group[]
    summary?: { group_count: number; market_count: number; result_count: number }
  }
  message?: string
  error?: string
}

const HIDDEN_LOTTERY_GROUP_ID = 5
const HIDDEN_LOTTERY_GROUP_NAME = 'หวยยี่กี'
export const MARKET_RESULTS_PAGE_SIZE = 30
const UPSTREAM_MARKET_RESULTS_PAGE_SIZE = 3
const DEFAULT_REVALIDATE_SECONDS = 60

type FetchCacheOptions = {
  cache?: RequestCache
  revalidate?: number
}

function apiFetchOptions(lang: string, options: FetchCacheOptions = {}): RequestInit & { next?: { revalidate?: number } } {
  const requestOptions: RequestInit & { next?: { revalidate?: number } } = {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'X-Language': lang,
    },
  }

  if (options.cache === 'no-store') {
    requestOptions.cache = 'no-store'
  } else {
    requestOptions.next = { revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS }
  }

  return requestOptions
}

function normalizedGroupName(name: string | null | undefined): string {
  return (name ?? '').replace(/\s+/g, '')
}

function resultCount(groups: Group[]): number {
  return groups.reduce(
    (sum, group) => sum + group.markets.filter(market => (
      market.result?.result_number && !market.result.result_number.no_result
    )).length,
    0,
  )
}

export function isHiddenLotteryGroup(group: Pick<Group, 'group_id' | 'group_name'>): boolean {
  return (
    group.group_id === HIDDEN_LOTTERY_GROUP_ID ||
    normalizedGroupName(group.group_name) === normalizedGroupName(HIDDEN_LOTTERY_GROUP_NAME)
  )
}

export function isHiddenLotteryMarket(
  market: { group_id?: number | null; group_name?: string | null } | null | undefined,
): boolean {
  return (
    market?.group_id === HIDDEN_LOTTERY_GROUP_ID ||
    normalizedGroupName(market?.group_name) === normalizedGroupName(HIDDEN_LOTTERY_GROUP_NAME)
  )
}

export function hideHiddenLotteryGroups(response: LotteryByDateResponse): LotteryByDateResponse {
  if (!response.data) return response

  const groups = response.data.groups.filter(group => !isHiddenLotteryGroup(group))
  const summary = response.data.summary ? {
    ...response.data.summary,
    group_count: groups.length,
    market_count: groups.reduce((sum, group) => sum + group.markets.length, 0),
    result_count: resultCount(groups),
  } : response.data.summary

  return {
    ...response,
    data: {
      ...response.data,
      groups,
      summary,
    },
  }
}

export function todayBangkok(): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return fmt.format(new Date())
}

export async function fetchLotteryByDate(
  date: string,
  lang: string = 'th',
  options: FetchCacheOptions = {},
): Promise<LotteryByDateResponse> {
  const url = `https://api.1168lot.com/api/v1/lotto/results/by-date?date=${encodeURIComponent(date)}`
  const res = await fetch(url, apiFetchOptions(lang, options))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const payload: LotteryByDateResponse = await res.json()
  return hideHiddenLotteryGroups(payload)
}

export async function fetchMarketResults(
  id: string,
  lang: string = 'th',
  options: { page?: number; limit?: number } & FetchCacheOptions = {},
): Promise<MarketDetailResponse> {
  const requestedPage = Math.max(1, options.page ?? 1)
  const requestedLimit = Math.max(1, options.limit ?? MARKET_RESULTS_PAGE_SIZE)

  if (requestedLimit <= UPSTREAM_MARKET_RESULTS_PAGE_SIZE) {
    return fetchMarketResultsPage(id, lang, requestedPage, requestedLimit, options)
  }

  const startIndex = (requestedPage - 1) * requestedLimit
  const upstreamStartPage = Math.floor(startIndex / UPSTREAM_MARKET_RESULTS_PAGE_SIZE) + 1
  const upstreamSkip = startIndex % UPSTREAM_MARKET_RESULTS_PAGE_SIZE
  const upstreamPageCount = Math.ceil((upstreamSkip + requestedLimit) / UPSTREAM_MARKET_RESULTS_PAGE_SIZE)

  const firstPage = await fetchMarketResultsPage(id, lang, upstreamStartPage, UPSTREAM_MARKET_RESULTS_PAGE_SIZE, options)
  const pages: MarketDetailResponse[] = [firstPage]

  if (firstPage.data?.pagination?.has_more && upstreamPageCount > 1) {
    const pageNumbers = Array.from(
      { length: upstreamPageCount - 1 },
      (_, index) => upstreamStartPage + index + 1,
    )
    const settledPages = await Promise.allSettled(
      pageNumbers.map(page => (
        fetchMarketResultsPage(id, lang, page, UPSTREAM_MARKET_RESULTS_PAGE_SIZE, options)
          .then(response => ({ page, response }))
      )),
    )

    pages.push(
      ...settledPages
        .filter((result): result is PromiseFulfilledResult<{ page: number; response: MarketDetailResponse }> => (
          result.status === 'fulfilled'
        ))
        .sort((a, b) => a.value.page - b.value.page)
        .map(result => result.value.response),
    )
  }

  const history = pages.flatMap(page => page.data?.history ?? []).slice(upstreamSkip, upstreamSkip + requestedLimit)
  const total = firstPage?.data?.pagination?.total ?? history.length

  return {
    ...(firstPage ?? { success: false }),
    data: firstPage?.data ? {
      ...firstPage.data,
      history,
      pagination: {
        page: requestedPage,
        limit: requestedLimit,
        count: history.length,
        total,
        has_more: requestedPage * requestedLimit < total,
      },
    } : firstPage?.data,
  }
}

async function fetchMarketResultsPage(
  id: string,
  lang: string,
  page: number,
  limit: number,
  options: FetchCacheOptions = {},
): Promise<MarketDetailResponse> {
  const url = new URL(`https://api.1168lot.com/api/v1/lotto/markets/${encodeURIComponent(id)}/results`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url, apiFetchOptions(lang, options))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
