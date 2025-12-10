import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulación de carga profesional
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 segundo de carga
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="medical-pulse"></div>
        <p>Cargando PerfilMed...</p>
      </div>
    );
  }

  return (
    <div className="home-container fade-in-page">
      {/* SECCIÓN HERO (Principal) */}
      <header className="hero-section">
        <div className="hero-content">
          {/* Título principal con el nombre completo */}
          <h1 className="title-animate">Dr. Alexander Yhair Vaca Saldaña</h1>
          <p className="fade-up-delay-1 hero-specialty">Especialista en Cardiología Pediátrica Integral.</p>
          
          <div className="hero-buttons fade-up-delay-2">
            <Link to="/ofertas" className="btn-hero primary">
              <span role="img" aria-label="Calendario">📅</span> Agendar Cita
            </Link>
            <Link to="/ubicacion" className="btn-hero secondary">
              <span role="img" aria-label="Ubicación">📍</span> Ver Ubicación
            </Link>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE BIENVENIDA */}
      <section className="welcome-section fade-up-delay-3">
        <h2 className="welcome-title">Cuidado Especializado para el Corazón de tu Niño</h2>
        <p>
          El Dr. Alexander Yhair Vaca Saldaña ofrece una atención integral y humanizada en cardiología pediátrica. 
          Nuestro compromiso es con el bienestar cardiovascular de sus hijos, brindando diagnósticos precisos 
          y tratamientos con la tecnología más avanzada en un ambiente de total confianza.
        </p>
      </section>

      {/* SECCIÓN DE SERVICIOS RÁPIDOS */}
      <section className="features-section">
        <div className="feature-card hover-card">
          <div className="icon heart-pulse">❤️</div>
          <h3>Cardiología Pediátrica</h3>
          <p>Diagnóstico y manejo de cardiopatías congénitas y adquiridas en niños y adolescentes.</p>
        </div>
        <div className="feature-card hover-card">
          <div className="icon stethoscope">🩺</div>
          <h3>Ecocardiografía Avanzada</h3>
          <p>Estudios no invasivos de alta resolución para evaluar la estructura y función cardíaca.</p>
        </div>
        <div className="feature-card hover-card">
          <div className="icon calendar">📅</div>
          <h3>Consulta Integral</h3>
          <p>Evaluación, seguimiento y educación para padres sobre la salud cardiovascular infantil.</p>
        </div>
      </section>
    </div>
  );
}