"use client"

import { useState, useEffect } from "react"
import styles from "./Forms.module.css"
import commonStyles from "./Common.module.css"

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      })
    }
  }, [usuario])

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Editar Usuario</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="nombre" className={styles.formLabel}>
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del usuario"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? styles.inputError : styles.formInput}
            />
            {errors.nombre && <p className={styles.errorText}>{errors.nombre}</p>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : styles.formInput}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.formField}>
            <label htmlFor="rol" className={styles.formLabel}>
              Rol de Usuario
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className={errors.rol ? styles.inputError : styles.formSelect}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && <p className={styles.errorText}>{errors.rol}</p>}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={commonStyles.secondaryButton} onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className={commonStyles.primaryButton}>
            Actualizar
          </button>
        </div>
      </form>
    </div>
  )
}

export default UsuarioForm
