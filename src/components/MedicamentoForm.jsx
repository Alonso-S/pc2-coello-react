"use client"

import { useState, useEffect } from "react"
import styles from "./Forms.module.css"
import commonStyles from "./Common.module.css"

const MedicamentoForm = ({ medicamento, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    descripcionMed: "",
    precioVentaUni: "",
    stock: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (medicamento) {
      setFormData({
        descripcionMed: medicamento.descripcionMed,
        precioVentaUni: medicamento.precioVentaUni.toString(),
        stock: medicamento.stock.toString(),
      })
    }
  }, [medicamento])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.descripcionMed.trim()) {
      newErrors.descripcionMed = "La descripción es requerida"
    }

    if (!formData.precioVentaUni) {
      newErrors.precioVentaUni = "El precio es requerido"
    } else if (isNaN(formData.precioVentaUni) || Number.parseFloat(formData.precioVentaUni) <= 0) {
      newErrors.precioVentaUni = "El precio debe ser un número positivo"
    }

    if (!formData.stock) {
      newErrors.stock = "El stock es requerido"
    } else if (isNaN(formData.stock) || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser un número no negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Convertir a números los campos numéricos
    const dataToSubmit = {
      ...formData,
      precioVentaUni: Number.parseFloat(formData.precioVentaUni),
      stock: Number.parseInt(formData.stock),
    }

    onSubmit(dataToSubmit)
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>{medicamento ? "Editar Medicamento" : "Nuevo Medicamento"}</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="descripcionMed" className={styles.formLabel}>
              Descripción
            </label>
            <input
              type="text"
              id="descripcionMed"
              name="descripcionMed"
              placeholder="Nombre del medicamento"
              value={formData.descripcionMed}
              onChange={handleChange}
              className={errors.descripcionMed ? styles.inputError : styles.formInput}
            />
            {errors.descripcionMed && <p className={styles.errorText}>{errors.descripcionMed}</p>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="precioVentaUni" className={styles.formLabel}>
              Precio de Venta
            </label>
            <div className={styles.inputGroup}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="number"
                step="0.01"
                id="precioVentaUni"
                name="precioVentaUni"
                placeholder="0.00"
                value={formData.precioVentaUni}
                onChange={handleChange}
                className={errors.precioVentaUni ? styles.inputError : styles.formInput}
              />
            </div>
            {errors.precioVentaUni && <p className={styles.errorText}>{errors.precioVentaUni}</p>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="stock" className={styles.formLabel}>
              Stock Disponible
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="Cantidad disponible"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? styles.inputError : styles.formInput}
            />
            {errors.stock && <p className={styles.errorText}>{errors.stock}</p>}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={commonStyles.secondaryButton} onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className={commonStyles.primaryButton}>
            {medicamento ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MedicamentoForm
