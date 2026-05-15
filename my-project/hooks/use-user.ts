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
      if (result) {
        setUser(result)
        window.dispatchEvent(new Event("storage"))
        return { success: true, user: result }
      }
      return { success: false, message: "البريد أو كلمة المرور غير صحيحة" }
    },
    []
  )

  const register = useCallback(
    (name: string, email: string, password: string, avatar?: string) => {
      const result = registerUser(name, email, password)
      if (result) {
        if (avatar) {
          const updated = updateUserProfile({ avatar })
          if (updated) setUser(updated)
        } else {
          setUser(result)
        }
        window.dispatchEvent(new Event("storage"))
        return { success: true, user: result }
      }
      return { success: false, message: "البريد مستخدم مسبقاً" }
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
      const updated = updateUserProfile(updates)
      if (updated) {
        setUser(updated)
        window.dispatchEvent(new Event("storage"))
      }
      return updated
    },
    []
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
