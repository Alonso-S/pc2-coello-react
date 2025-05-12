"use client";

import { useEffect, useState } from "react";
import styles from "./Forms.module.css";
import commonStyles from "./Common.module.css";

const OrdenCompraForm = ({ orden, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fechaEmision: "",
        Total: "",
        Situacion: "Pendiente",
        NrofacturaProv: "",
        CodLab: 1,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (orden) {
            setFormData({
                fechaEmision: orden.fechaEmision.split("T")[0],
                Total: orden.Total,
                Situacion: orden.Situacion,
                NrofacturaProv: orden.NrofacturaProv,
                CodLab: orden.CodLab,
            });
        }
    }, [orden]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation
        if (!formData.Total || isNaN(formData.Total)) {
            setErrors({ Total: "El total debe ser un número válido" });
            return;
        }
        onSubmit({ ...formData, Total: Number(formData.Total) });
    };

    return (
        <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>{orden ? "Editar Orden" : "Nueva Orden"}</h2>

                <div className={styles.formField}>
                    <label>Fecha de Emisión</label>
                    <input
                        type="date"
                        name="fechaEmision"
                        value={formData.fechaEmision}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formField}>
                    <label>Total</label>
                    <input
                        type="number"
                        name="Total"
                        value={formData.Total}
                        onChange={handleChange}
                        className={errors.Total ? styles.inputError : ""}
                    />
                    {errors.Total && (
                        <span className={styles.errorText}>{errors.Total}</span>
                    )}
                </div>

                <div className={styles.formField}>
                    <label>Situación</label>
                    <select
                        name="Situacion"
                        value={formData.Situacion}
                        onChange={handleChange}
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagada">Pagada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                </div>

                <div className={styles.formField}>
                    <label>Nro. Factura Proveedor</label>
                    <input
                        type="text"
                        name="NrofacturaProv"
                        value={formData.NrofacturaProv}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={commonStyles.secondaryButton}
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={commonStyles.primaryButton}
                    >
                        {orden ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrdenCompraForm;
