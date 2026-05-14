"use client"

import { useState, useEffect, useCallback } from "react"

const TYPOGRAPHY_KEY = "alzahrani_typography_v1"

export interface TypographySettings {
  fontSize: number
  fontFamily: "Tajawal" | "Amiri"
  lineHeight: number
}

const defaults: TypographySettings = {
  fontSize: 1,
  fontFamily: "Tajawal",
  lineHeight: 1.8,
}

function getSettings(): TypographySettings {
  if (typeof window === "undefined") return defaults
  const stored = localStorage.getItem(TYPOGRAPHY_KEY)
  if (!stored) return defaults
  try {
    return { ...defaults, ...JSON.parse(stored) }
  } catch {
    return defaults
  }
}

function saveSettings(settings: TypographySettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(TYPOGRAPHY_KEY, JSON.stringify(settings))
}

export function useTypography() {
  const [settings, setSettingsState] = useState<TypographySettings>(defaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const s = getSettings()
    setSettingsState(s)
    applyToDocument(s)
    setReady(true)
  }, [])

  const applyToDocument = useCallback((s: TypographySettings) => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    root.style.setProperty("--font-scale", String(s.fontSize))
    root.style.setProperty("--font-body", s.fontFamily)
    root.style.setProperty("--line-height-body", String(s.lineHeight))
  }, [])

  const setSettings = useCallback(
    (updates: Partial<TypographySettings>) => {
      const next = { ...settings, ...updates }
      setSettingsState(next)
      saveSettings(next)
      applyToDocument(next)
      window.dispatchEvent(new Event("typography-change"))
    },
    [settings, applyToDocument]
  )

  const reset = useCallback(() => {
    setSettingsState(defaults)
    saveSettings(defaults)
    applyToDocument(defaults)
    window.dispatchEvent(new Event("typography-change"))
  }, [applyToDocument])

  return {
    settings,
    ready,
    setSettings,
    reset,
    increaseSize: () => setSettings({ fontSize: Math.min(1.3, settings.fontSize + 0.1) }),
    decreaseSize: () => setSettings({ fontSize: Math.max(0.8, settings.fontSize - 0.1) }),
  }
}
