"use client"

import { useState, useEffect, useCallback } from "react"

const FOCUS_KEY = "alzahrani_focus_mode"

function getFocusMode(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(FOCUS_KEY) === "true"
}

function setFocusModeStorage(value: boolean) {
  if (typeof window === "undefined") return
  if (value) {
    sessionStorage.setItem(FOCUS_KEY, "true")
  } else {
    sessionStorage.removeItem(FOCUS_KEY)
  }
}

function applyToDocument(active: boolean) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (active) {
    root.classList.add("focus-mode")
  } else {
    root.classList.remove("focus-mode")
  }
}

export function useFocusMode() {
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const initial = getFocusMode()
    setActive(initial)
    applyToDocument(initial)
    setReady(true)
  }, [])

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev
      setFocusModeStorage(next)
      applyToDocument(next)
      window.dispatchEvent(new Event("focus-mode-change"))
      return next
    })
  }, [])

  const enable = useCallback(() => {
    setActive(true)
    setFocusModeStorage(true)
    applyToDocument(true)
    window.dispatchEvent(new Event("focus-mode-change"))
  }, [])

  const disable = useCallback(() => {
    setActive(false)
    setFocusModeStorage(false)
    applyToDocument(false)
    window.dispatchEvent(new Event("focus-mode-change"))
  }, [])

  return { active, ready, toggle, enable, disable }
}
