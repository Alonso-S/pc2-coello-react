import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import MedicamentosPage from "./pages/MedicamentosPage";
import UsuariosPage from "./pages/UsuariosPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import styles from "./App.module.css";
import OrdenesCompraPage from "./pages/OrdenesCompraPage";

function App() {
  return (
    <AuthProvider>
      <div className={styles.appContainer}>
        <Navbar />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicamentos"
              element={
                <ProtectedRoute>
                  <MedicamentosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordenes"
              element={
                <ProtectedRoute>
                  <OrdenesCompraPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <AdminRoute>
                  <UsuariosPage />
                </AdminRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <p>Sistema de Gestión Farmacéutica © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
