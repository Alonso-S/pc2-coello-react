"use client";

import { useEffect, useState } from "react";
import UsuarioForm from "../components/UsuarioForm";
import styles from "./TablePages.module.css";
import commonStyles from "../components/Common.module.css";

const UsuariosPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      setUsuarios(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEdit = (usuario) => {
    setCurrentUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }

      // Actualizar la lista
      setUsuarios(usuarios.filter((user) => user.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${API_URL}/usuarios/${currentUsuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Error al actualizar usuario");
      }

      // Actualizar la lista
      fetchUsuarios();
      setShowForm(false);
      setCurrentUsuario(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando usuarios...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gestión de Usuarios</h1>
          <p className={styles.pageDescription}>
            Administra los usuarios del sistema
          </p>
        </div>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {showForm && (
        <UsuarioForm
          usuario={currentUsuario}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setCurrentUsuario(null);
          }}
        />
      )}

      {usuarios.length === 0
        ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>👥</div>
            <h3 className={styles.emptyStateTitle}>
              No hay usuarios registrados
            </h3>
            <p className={styles.emptyStateDescription}>
              No se encontraron usuarios en el sistema
            </p>
          </div>
        )
        : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.idColumn}>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`${styles.roleBadge} ${
                          user.rol === "admin"
                            ? styles.roleAdmin
                            : styles.roleUser
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>
                    <td className={styles.actionsColumn}>
                      <button
                        className={commonStyles.primaryButton}
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button
                        className={commonStyles.dangerButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default UsuariosPage;
