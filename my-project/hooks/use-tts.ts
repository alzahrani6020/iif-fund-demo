"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TTSState {
  speaking: boolean
  paused: boolean
  supported: boolean
  rate: number
  currentVoice: SpeechSynthesisVoice | null
  voices: SpeechSynthesisVoice[]
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    speaking: false,
    paused: false,
    supported: false,
    rate: 0.9,
    currentVoice: null,
    voices: [],
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices()
      const arVoices = allVoices.filter((v) => v.lang.startsWith("ar"))
      const preferred =
        arVoices.find((v) => v.lang === "ar-SA") ||
        arVoices.find((v) => v.lang === "ar-SA") ||
        arVoices[0] ||
        allVoices[0]

      setState((prev) => ({
        ...prev,
        supported: true,
        voices: allVoices,
        currentVoice: preferred || null,
      }))
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    // Poll for state changes since speechSynthesis events are not reactive
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        speaking: window.speechSynthesis.speaking,
        paused: window.speechSynthesis.paused,
      }))
    }, 200)

    return () => {
      clearInterval(interval)
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ar-SA"
      utterance.rate = state.rate
      if (state.currentVoice) utterance.voice = state.currentVoice

      utterance.onend = () => {
        setState((prev) => ({ ...prev, speaking: false, paused: false }))
      }

      utterance.onerror = () => {
        setState((prev) => ({ ...prev, speaking: false, paused: false }))
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setState((prev) => ({ ...prev, speaking: true, paused: false }))
    },
    [state.rate, state.currentVoice]
  )

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    setState((prev) => ({ ...prev, speaking: false, paused: false }))
  }, [])

  const pause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.pause()
    setState((prev) => ({ ...prev, paused: true }))
  }, [])

  const resume = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.resume()
    setState((prev) => ({ ...prev, paused: false }))
  }, [])

  const togglePlay = useCallback(
    (text: string) => {
      if (state.speaking && !state.paused) {
        pause()
      } else if (state.paused) {
        resume()
      } else {
        speak(text)
      }
    },
    [state.speaking, state.paused, speak, pause, resume]
  )

  const setRate = useCallback((rate: number) => {
    setState((prev) => ({ ...prev, rate }))
  }, [])

  const setVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setState((prev) => ({ ...prev, currentVoice: voice }))
  }, [])

  return {
    ...state,
    speak,
    stop,
    pause,
    resume,
    togglePlay,
    setRate,
    setVoice,
  }
}
