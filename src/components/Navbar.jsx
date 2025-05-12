"use client";

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Llamada al backend para logout (opcional)
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Independientemente de la respuesta, hacemos logout local
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, hacemos logout local
      logout();
      navigate("/login");
    }
  };

  if (!currentUser) {
    return (
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>MediControl</h1>
          </div>
          <nav className={styles.nav}>
            <Link to="/login" className={styles.navLink}>
              Iniciar Sesión
            </Link>
            <Link to="/register" className={styles.navLink}>
              Crear Cuenta
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>MediControl</h1>
        </div>
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navLink}>
            Inicio
          </Link>
          <Link to="/medicamentos" className={styles.navLink}>
            Inventario
          </Link>
          {isAdmin() && (
            <Link to="/usuarios" className={styles.navLink}>
              Usuarios
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Salir
          </button>
        </nav>
      </div>
      <div className={styles.userInfo}>
        <span className={styles.userEmail}>{currentUser.email}</span>
        <span className={styles.userRole}>
          {currentUser.rol === "admin" ? "Administrador" : "Usuario"}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
