"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import styles from "./Common.module.css"

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando recursos...</div>
  }

  if (!currentUser || !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
