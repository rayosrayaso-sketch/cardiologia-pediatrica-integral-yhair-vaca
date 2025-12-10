import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, query, where, getCountFromServer, getDocs, limit } from "firebase/firestore";
import "./Admin.css"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({ citasPendientes: 0, totalServicios: 0 });
  const [citasRecientes, setCitasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Contar Citas Pendientes
    const qCitas = query(collection(db, "citas"), where("estado", "==", "pendiente"));
    const snapCitas = await getCountFromServer(qCitas);
    
    // 2. Contar Servicios
    const qServicios = collection(db, "servicios");
    const snapServicios = await getCountFromServer(qServicios);
    
    // 3. Obtener Citas Recientes (5) para el resumen
    const qRecientes = query(collection(db, "citas"), limit(5));
    const citasSnap = await getDocs(qRecientes);
    const recientes = citasSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    setStats({
      citasPendientes: snapCitas.data().count,
      totalServicios: snapServicios.data().count,
    });
    setCitasRecientes(recientes);
    setLoading(false);
  };

  const getEstadoClass = (estado) => {
    if (estado === 'confirmada') return 'status-confirmada';
    if (estado === 'cancelada') return 'status-cancelada';
    return 'status-pendiente';
  };

  if (loading) return (
    <div className="loading-admin">
      <div className="spinner"></div>
      <p>Cargando Panel de Control...</p>
    </div>
  );

  return (
    <div className="admin-container fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Cardiología Pediátrica Integral</h1>
          <p>Panel de Administración. Resumen de actividad reciente.</p>
        </div>
        <div className="date-badge">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      {/* Tarjetas de Estadísticas (Widgets) */}
      <div className="stats-grid">
        
        {/* Widget: Citas Pendientes */}
        <div className="stat-card urgent">
          <div className="stat-icon-bg">🔔</div>
          <div className="stat-info">
            <h2>{stats.citasPendientes}</h2>
            <p>Citas Pendientes</p>
          </div>
          <Link to="/admin/citas" className="stat-link">Revisar Ahora →</Link>
        </div>

        {/* Widget: Servicios */}
        <div className="stat-card info">
          <div className="stat-icon-bg">🩺</div>
          <div className="stat-info">
            <h2>{stats.totalServicios}</h2>
            <p>Servicios Activos</p>
          </div>
          <Link to="/admin/servicios" className="stat-link">Gestionar →</Link>
        </div>

        {/* Widget: Ubicación */}
        <div className="stat-card location">
          <div className="stat-icon-bg">📍</div>
          <div className="stat-info">
            <h3>Ubicación</h3>
            <p>Mapa Consultorio</p>
          </div>
          <Link to="/admin/ubicacion" className="stat-link">Actualizar →</Link>
        </div>

        {/* Widget: Blog */}
        <div className="stat-card blog">
          <div className="stat-icon-bg">📰</div>
          <div className="stat-info">
            <h3>Blog Médico</h3>
            <p>Publicaciones</p>
          </div>
          <Link to="/admin/investigacion" className="stat-link">Editar →</Link>
        </div>

        {/* Widget: CV */}
        <div className="stat-card profile">
          <div className="stat-icon-bg">👨‍⚕️</div>
          <div className="stat-info">
            <h3>Perfil Pro</h3>
            <p>Currículum</p>
          </div>
          <Link to="/admin/curriculum" className="stat-link">Editar →</Link>
        </div>

        {/* Widget: Contactos */}
        <div className="stat-card contact">
          <div className="stat-icon-bg">📞</div>
          <div className="stat-info">
            <h3>Contacto</h3>
            <p>Info Pública</p>
          </div>
          <Link to="/admin/contactos" className="stat-link">Editar →</Link>
        </div>
      </div>
      
      {/* Sección: Citas Recientes */}
      <section className="citas-recientes-section slide-up delay-1">
        <div className="section-header">
          <h2>📅 Actividad Reciente</h2>
          <Link to="/admin/citas" className="link-ver-todas">Ver todas las citas</Link>
        </div>

        {citasRecientes.length === 0 ? (
          <div className="empty-dashboard-state">
            <p>No hay actividad reciente para mostrar.</p>
          </div>
        ) : (
          <div className="citas-list-dashboard">
            {citasRecientes.map(cita => (
              <div key={cita.id} className="cita-reciente-item">
                <div className="cita-main-info">
                  <strong>{cita.servicio}</strong>
                  <span className="cita-email">{cita.userEmail}</span>
                </div>
                <div className="cita-meta">
                  <span className="cita-date">{cita.fecha} - {cita.hora}</span>
                  <span className={`cita-status-badge ${getEstadoClass(cita.estado)}`}>
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}