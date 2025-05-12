"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import styles from "./Dashboard.module.css"

const Dashboard = () => {
  const { currentUser, isAdmin } = useContext(AuthContext)

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Panel de Control</h1>
        <p className={styles.welcomeText}>
          Bienvenido al sistema de gestión farmacéutica, <span className={styles.userName}>{currentUser?.email}</span>
        </p>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Inventario</h3>
            <p className={styles.statDescription}>Gestiona el inventario de medicamentos</p>
          </div>
        </div>

        {isAdmin() && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <h3 className={styles.statTitle}>Usuarios</h3>
              <p className={styles.statDescription}>Administra los usuarios del sistema</p>
            </div>
          </div>
        )}

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3 className={styles.statTitle}>Reportes</h3>
            <p className={styles.statDescription}>Visualiza reportes y estadísticas</p>
          </div>
        </div>
      </div>

      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.actionCards}>
          <Link to="/medicamentos" className={styles.actionCard}>
            <div className={styles.actionIcon}>🔍</div>
            <h3 className={styles.actionTitle}>Ver Inventario</h3>
            <p className={styles.actionDescription}>Consulta el inventario actual de medicamentos</p>
          </Link>

          {isAdmin() && (
            <Link to="/usuarios" className={styles.actionCard}>
              <div className={styles.actionIcon}>👤</div>
              <h3 className={styles.actionTitle}>Gestionar Usuarios</h3>
              <p className={styles.actionDescription}>Administra los usuarios del sistema</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
