import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
      {/* SECCIÓN HERO */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <h1 className="title-animate">
              Dr. Alexander <br />
              <span className="highlight">Yhair Vaca Saldaña</span>
            </h1>
            <p className="hero-specialty fade-up-delay-1">
              Especialista en Cardiología Pediátrica Integral
            </p>
            
            <div className="hero-buttons fade-up-delay-2">
              <Link to="/ofertas" className="btn-hero primary">
                <span className="icon-emoji">📅</span> Agendar Cita
              </Link>
              <Link to="/ubicacion" className="btn-hero secondary">
                <span className="icon-emoji">📍</span> Ubicación
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE BIENVENIDA */}
      <section className="welcome-section fade-up-delay-3">
        <div className="container">
          <h2 className="welcome-title">Cuidado Especializado para el Corazón de tu Niño</h2>
          <div className="divider-custom"></div>
          <p className="welcome-text">
            Atención integral y humanizada en cardiología pediátrica. 
            Nuestro compromiso es el bienestar cardiovascular de sus hijos con tecnología avanzada.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE SERVICIOS */}
      <section className="features-grid">
        <div className="feature-item">
          <div className="feature-icon">❤️</div>
          <h3>Cardiología Pediátrica</h3>
          <p>Manejo de cardiopatías congénitas en niños y adolescentes.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🩺</div>
          <h3>Ecocardiografía</h3>
          <p>Estudios no invasivos de alta resolución funcional.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">📅</div>
          <h3>Consulta Integral</h3>
          <p>Evaluación y educación continua para los padres.</p>
        </div>
      </section>
    </div>
  );
}