'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Plus, Share, Smartphone, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { DICT, isLang, type Lang } from '@/lib/i18n'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

function isIosDevice() {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isAndroidDevice() {
  if (typeof window === 'undefined') return false
  return /android/i.test(window.navigator.userAgent)
}

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export default function AddToHomeScreen() {
  const pathname = usePathname()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showButton, setShowButton] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const lang: Lang = useMemo(() => {
    const value = pathname.split('/')[1]
    return isLang(value) ? value : 'th'
  }, [pathname])
  const t = DICT[lang]
  const platform = useMemo(() => {
    if (isIosDevice()) return 'ios'
    if (isAndroidDevice()) return 'android'
    return 'other'
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    if (isStandalone() || window.localStorage.getItem('a2hs-dismissed') === '1') return

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)

    const iosButtonFrame = isIosDevice() ? window.requestAnimationFrame(() => setShowButton(true)) : null

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      if (iosButtonFrame !== null) window.cancelAnimationFrame(iosButtonFrame)
    }
  }, [])

  const install = async () => {
    if (platform === 'ios' || !installPrompt) {
      setShowInstructions(true)
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setShowButton(false)
    }
    setInstallPrompt(null)
  }

  const dismiss = () => {
    window.localStorage.setItem('a2hs-dismissed', '1')
    setShowButton(false)
    setShowInstructions(false)
  }

  if (!showButton) return null

  return (
    <>
      <div className="a2hs-button-wrap">
        <button type="button" className="a2hs-button" onClick={install}>
          <Smartphone size={17} />
          <span>{t.addToHomeScreen}</span>
        </button>
        <button type="button" className="a2hs-dismiss" onClick={dismiss} aria-label={t.hideAddToHomeScreen}>
          <X size={15} />
        </button>
      </div>

      {showInstructions && (
        <div className="a2hs-overlay" onClick={() => setShowInstructions(false)}>
          <div className="a2hs-panel" onClick={event => event.stopPropagation()}>
            <div className="a2hs-panel-head">
              <div>
                <span>{t.installApp}</span>
                <strong>{t.addToHomeScreen}</strong>
              </div>
              <button type="button" className="icon-btn" onClick={() => setShowInstructions(false)} aria-label={t.close}>
                <X size={16} />
              </button>
            </div>

            <ol className="a2hs-steps">
              {platform === 'ios' ? (
                <>
                  <li>
                    <Share size={18} />
                    <span>{t.iosInstallStepShare}</span>
                  </li>
                  <li>
                    <Plus size={18} />
                    <span>{t.iosInstallStepAddToHome}</span>
                  </li>
                  <li>
                    <Download size={18} />
                    <span>{t.iosInstallStepConfirm}</span>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Download size={18} />
                    <span>{t.androidInstallStepMenu}</span>
                  </li>
                  <li>
                    <Plus size={18} />
                    <span>{t.androidInstallStepInstall}</span>
                  </li>
                </>
              )}
            </ol>
          </div>
        </div>
      )}
    </>
  )
}
