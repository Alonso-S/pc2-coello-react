"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import OrdenCompraForm from "../components/OrdenCompraForm";
import styles from "./TablePages.module.css";
import commonStyles from "../components/Common.module.css";

const OrdenesCompraPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentOrden, setCurrentOrden] = useState(null);
    const { isAdmin } = useContext(AuthContext);

    const fetchOrdenes = async () => {
        try {
            const response = await fetch(`${API_URL}/ordencompras`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar las órdenes de compra");
            }

            const data = await response.json();
            setOrdenes(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    const handleEdit = (orden) => {
        setCurrentOrden(orden);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta orden?")) return;

        try {
            const response = await fetch(`${API_URL}/ordencompras/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al eliminar orden");

            setOrdenes(ordenes.filter((orden) => orden.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            let url = `${API_URL}/ordencompras`;
            let method = "POST";

            if (currentOrden) {
                url = `${url}/${currentOrden.id}`;
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
                    `Error al ${currentOrden ? "actualizar" : "crear"} orden`,
                );
            }

            fetchOrdenes();
            setShowForm(false);
            setCurrentOrden(null);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>Cargando órdenes...</div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Órdenes de Compra</h1>
                {isAdmin() && (
                    <button
                        className={commonStyles.successButton}
                        onClick={() => {
                            setCurrentOrden(null);
                            setShowForm(true);
                        }}
                    >
                        Nueva Orden
                    </button>
                )}
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            {showForm && (
                <OrdenCompraForm
                    orden={currentOrden}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setCurrentOrden(null);
                    }}
                />
            )}

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Situación</th>
                            <th>Nro. Factura</th>
                            {isAdmin() && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map((orden) => (
                            <tr key={orden.id}>
                                <td>{orden.id}</td>
                                <td>
                                    {new Date(orden.fechaEmision)
                                        .toLocaleDateString()}
                                </td>
                                <td>${orden.Total}</td>
                                <td>{orden.Situacion}</td>
                                <td>{orden.NrofacturaProv}</td>
                                {isAdmin() && (
                                    <td>
                                        <button
                                            className={commonStyles
                                                .primaryButton}
                                            onClick={() => handleEdit(orden)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={commonStyles
                                                .dangerButton}
                                            onClick={() =>
                                                handleDelete(orden.id)}
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
        </div>
    );
};

export default OrdenesCompraPage;
