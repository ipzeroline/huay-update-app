import { LANG_LOCALE, type Lang } from '@/lib/i18n'
import { localizedPath, seoLangs } from '@/lib/seo'

function cleanSlugText(value: string) {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[/?#[\]{}|\\^`<>]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function marketSlug(marketName: string, lang: Lang = 'th') {
  const compactName = cleanSlugText(marketName).replace(/-/g, '')
  if (lang === 'th') return `ผลหวย${compactName}วันนี้`
  return cleanSlugText(`${marketName}-latest-results`).toLowerCase()
}

export function marketPath(id: string | number, marketName?: string, lang: Lang = 'th') {
  const base = `/market/${id}`
  return marketName ? `${base}/${marketSlug(marketName, lang)}` : base
}

export function localizedMarketPath(id: string | number, marketName: string | undefined, lang: Lang) {
  return localizedPath(marketPath(id, marketName, lang), lang)
}

export function marketLanguageAlternates(id: string | number, marketName: string) {
  return {
    'x-default': localizedMarketPath(id, marketName, 'th'),
    ...Object.fromEntries(
      seoLangs.map(lang => [LANG_LOCALE[lang], localizedMarketPath(id, marketName, lang)]),
    ),
  }
}
