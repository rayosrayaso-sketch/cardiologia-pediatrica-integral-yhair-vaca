import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // Crearemos estilos básicos abajo

export default function Navbar() {
  const { user, rol, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to={rol === "admin" ? "/admin" : "/"}>PerfilMed Victoria</Link>
      </div>
      <ul className="nav-links">
        {/* Menú para ADMINISTRADOR */}
        {user && rol === "admin" && (
          <>
            <li><Link to="/admin">Panel Principal</Link></li>
            <li><Link to="/admin/servicios">Gestionar Servicios</Link></li>
            <li><Link to="/admin/ubicacion">Gestionar Ubicación</Link></li>
            <li><Link to="/admin/investigacion">Gestionar Investigación</Link></li>
          </>
        )}

        {/* Menú para CLIENTES (Usuarios normales) */}
        {user && rol === "cliente" && (
          <>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/ubicacion">Ubicación</Link></li>
            <li><Link to="/ofertas">Oferta de Servicios</Link></li>
            <li><Link to="/investigacion">Investigación</Link></li>
            <li><a href="https://wa.me/591XXXXXXXX" target="_blank" rel="noopener noreferrer">Contactos</a></li>
          </>
        )}

        {/* Botón de Cerrar Sesión o Iniciar */}
        {user ? (
          <li><button onClick={handleLogout} className="btn-logout">Salir</button></li>
        ) : (
          <li><Link to="/login">Ingresar</Link></li>
        )}
      </ul>
    </nav>
  );
}