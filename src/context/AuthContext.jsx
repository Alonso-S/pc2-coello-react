"use client"

import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp < currentTime) {
          // Token expirado
          logout()
        } else {
          setCurrentUser({
            id: decoded.id,
            email: decoded.email,
            rol: decoded.rol,
          })
        }
      } catch (error) {
        console.error("Error al decodificar token:", error)
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setCurrentUser(null)
  }

  const isAdmin = () => {
    return currentUser?.rol === "admin"
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, loading }}>{children}</AuthContext.Provider>
  )
}
