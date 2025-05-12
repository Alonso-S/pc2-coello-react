"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MedicamentoForm from "../components/MedicamentoForm";
import styles from "./TablePages.module.css";
import commonStyles from "../components/Common.module.css";

const MedicamentosPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMedicamento, setCurrentMedicamento] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch(`${API_URL}/medicamentos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar medicamentos");
      }

      const data = await response.json();
      setMedicamentos(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const handleEdit = (medicamento) => {
    setCurrentMedicamento(medicamento);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este medicamento?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar medicamento");
      }

      // Actualizar la lista
      setMedicamentos(medicamentos.filter((med) => med.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let url = `${API_URL}/medicamentos`;
      let method = "POST";

      if (currentMedicamento) {
        url = `${url}/${currentMedicamento.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${currentMedicamento ? "actualizar" : "crear"} medicamento`,
        );
      }

      // Actualizar la lista
      fetchMedicamentos();
      setShowForm(false);
      setCurrentMedicamento(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>Cargando inventario...</div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inventario de Medicamentos</h1>
          <p className={styles.pageDescription}>
            Gestiona el inventario de productos farmacéuticos
          </p>
        </div>
        {isAdmin() && (
          <button
            className={commonStyles.successButton}
            onClick={() => {
              setCurrentMedicamento(null);
              setShowForm(true);
            }}
          >
            Nuevo Medicamento
          </button>
        )}
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {showForm && (
        <MedicamentoForm
          medicamento={currentMedicamento}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setCurrentMedicamento(null);
          }}
        />
      )}

      {medicamentos.length === 0
        ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📦</div>
            <h3 className={styles.emptyStateTitle}>
              No hay medicamentos registrados
            </h3>
            <p className={styles.emptyStateDescription}>
              {isAdmin()
                ? "Comienza agregando un nuevo medicamento al inventario"
                : "No hay medicamentos disponibles en el inventario"}
            </p>
          </div>
        )
        : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  {isAdmin() && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((med) => (
                  <tr key={med.id}>
                    <td className={styles.idColumn}>{med.id}</td>
                    <td>{med.descripcionMed}</td>
                    <td className={styles.priceColumn}>
                      ${Number(med.precioVentaUni).toFixed(2)}
                    </td>
                    <td className={styles.stockColumn}>
                      <span
                        className={`${styles.stockBadge} ${
                          med.stock > 10
                            ? styles.stockHigh
                            : med.stock > 0
                            ? styles.stockMedium
                            : styles.stockLow
                        }`}
                      >
                        {med.stock}
                      </span>
                    </td>
                    {isAdmin() && (
                      <td className={styles.actionsColumn}>
                        <button
                          className={commonStyles.primaryButton}
                          onClick={() => handleEdit(med)}
                        >
                          Editar
                        </button>
                        <button
                          className={commonStyles.dangerButton}
                          onClick={() => handleDelete(med.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default MedicamentosPage;
