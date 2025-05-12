"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPages.module.css";

const RegisterPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    // Eliminar confirmPassword antes de enviar al backend
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
      }

      // Registro exitoso, redirigir a login
      navigate("/login", {
        state: { message: "Registro exitoso. Por favor inicia sesión." },
      });
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authFormContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Crear Cuenta</h1>
          <p className={styles.authSubtitle}>
            Completa el formulario para registrarte en el sistema
          </p>
        </div>

        {apiError && <div className={styles.errorAlert}>{apiError}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formField}>
            <label htmlFor="nombre" className={styles.formLabel}>
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? styles.inputError : styles.formInput}
            />
            {errors.nombre && (
              <p className={styles.errorText}>{errors.nombre}</p>
            )}
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
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.inputError : styles.formInput}
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword
                ? styles.inputError
                : styles.formInput}
            />
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            Crear Cuenta
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className={styles.authLink}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
