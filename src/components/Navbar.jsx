import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  MapPin, 
  FlaskConical, 
  Calendar, 
  FileText, 
  Mail,
  Home,
  User,
  Stethoscope,
  Menu,
  X
} from "lucide-react";
import "./Navbar.css"; 

export default function Navbar() {
  const { user, rol, logout } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú en móviles
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Estado para controlar si el sidebar está colapsado en desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Función para cerrar el menú después de hacer clic en un enlace (útil en móvil)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Función para toggle del sidebar en desktop
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Efecto para agregar/quitar clase al body cuando el sidebar se colapsa
  useEffect(() => {
    if (window.innerWidth > 900) {
      if (isSidebarCollapsed) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    }

    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isSidebarCollapsed]);

  return (
    <>
      {/* Barra Superior */}
      <header className={`top-bar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <button 
          className="sidebar-toggle-desktop" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
        <h1 className="top-bar-title">Cardiología Pediátrica Integral</h1>
      </header>

      {/* Navbar Lateral */}
      <nav className={`navbar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="navbar-container">
          <div className="logo">
            <Link to={rol === "admin" ? "/admin" : "/"} onClick={handleLinkClick}>
              <span className="logo-icon">❤️</span>
              {!isSidebarCollapsed && <span className="logo-text">Cardiología Pediátrica Integral</span>}
            </Link>
          </div>

          {/* Botón de Hamburguesa para Móvil */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* El menú principal, dinámico para desktop y móvil */}
          <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            
            {/* Menú para ADMINISTRADOR */}
            {user && rol === "admin" && (
              <>
                <li>
                  <Link to="/admin" onClick={handleLinkClick}>
                    <LayoutDashboard size={20} />
                    {!isSidebarCollapsed && <span>Panel Principal</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/servicios" onClick={handleLinkClick}>
                    <Briefcase size={20} />
                    {!isSidebarCollapsed && <span>Gestionar Servicios</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/ubicacion" onClick={handleLinkClick}>
                    <MapPin size={20} />
                    {!isSidebarCollapsed && <span>Gestionar Ubicación</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/investigacion" onClick={handleLinkClick}>
                    <FlaskConical size={20} />
                    {!isSidebarCollapsed && <span>Gestionar Investigación</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/citas" onClick={handleLinkClick}>
                    <Calendar size={20} />
                    {!isSidebarCollapsed && <span>Gestionar Citas</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/curriculum" onClick={handleLinkClick}>
                    <FileText size={20} />
                    {!isSidebarCollapsed && <span>Gestionar CV</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/admin/contactos" onClick={handleLinkClick}>
                    <Mail size={20} />
                    {!isSidebarCollapsed && <span>Gestionar Contactos</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Menú para CLIENTES (Usuarios normales) */}
            {user && rol === "cliente" && (
              <>
                <li>
                  <Link to="/" onClick={handleLinkClick}>
                    <Home size={20} />
                    {!isSidebarCollapsed && <span>Inicio</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/sobre-mi" onClick={handleLinkClick}>
                    <User size={20} />
                    {!isSidebarCollapsed && <span>Sobre Mí</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/ubicacion" onClick={handleLinkClick}>
                    <MapPin size={20} />
                    {!isSidebarCollapsed && <span>Ubicación</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/ofertas" onClick={handleLinkClick}>
                    <Stethoscope size={20} />
                    {!isSidebarCollapsed && <span>Oferta de Servicios</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/investigacion" onClick={handleLinkClick}>
                    <FlaskConical size={20} />
                    {!isSidebarCollapsed && <span>Investigación</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/contactos" onClick={handleLinkClick}>
                    <Mail size={20} />
                    {!isSidebarCollapsed && <span>Contactos</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Botón de Cerrar Sesión o Iniciar */}
            {user ? (
              <li className="logout-item">
                <button onClick={handleLogout} className="btn-logout">
                  {isSidebarCollapsed ? "Salir" : "Cerrar sesión"}
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  {!isSidebarCollapsed && <span>Ingresar</span>}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}