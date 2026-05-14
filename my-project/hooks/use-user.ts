"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  type UserProfile,
} from "@/lib/data-store"

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const handleStorage = () => refresh()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [refresh])

  const login = useCallback(
    (email: string, password: string) => {
      const result = loginUser(email, password)
      if (result.success && result.user) {
        setUser(result.user)
        window.dispatchEvent(new Event("storage"))
      }
      return result
    },
    []
  )

  const register = useCallback(
    (name: string, email: string, password: string, avatar?: string) => {
      const result = registerUser(name, email, password, avatar)
      if (result.success && result.user) {
        setUser(result.user)
        window.dispatchEvent(new Event("storage"))
      }
      return result
    },
    []
  )

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    window.dispatchEvent(new Event("storage"))
  }, [])

  const update = useCallback(
    (updates: Partial<Omit<UserProfile, "id" | "email" | "createdAt">>) => {
      if (!user) return null
      const updated = updateUserProfile(user.id, updates)
      if (updated) {
        setUser(updated)
        window.dispatchEvent(new Event("storage"))
      }
      return updated
    },
    [user]
  )

  return {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    update,
    refresh,
  }
}
