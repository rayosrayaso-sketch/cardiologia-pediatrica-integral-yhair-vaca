import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Contactos.css";

export default function Contactos() {
  const [contacto, setContacto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacto = async () => {
      try {
        const docSnap = await getDoc(doc(db, "configuracion", "contacto"));
        if (docSnap.exists()) setContacto(docSnap.data());
      } catch (error) {
        console.error("Error al cargar contactos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacto();
  }, []);

  if (loading) {
    return (
      <div className="loading-contactos-screen">
        <div className="medical-spinner"></div>
        <p>Cargando información de contacto...</p>
      </div>
    );
  }

  if (!contacto) {
    return (
      <div className="contactos-error-view">
        <p>⚠️ La información de contacto no está disponible actualmente.</p>
      </div>
    );
  }

  return (
    <div className="contactos-page-wrapper fade-in">
      <header className="contactos-hero">
        <div className="hero-shape"></div>
        <span className="contact-badge">Atención Médica Integral</span>
        <h1>Canales de Atención</h1>
        <p>Estamos comprometidos con la salud cardiovascular de tus hijos. Elige tu medio de contacto preferido.</p>
      </header>

      <div className="contactos-main-grid">
        {/* Card WhatsApp */}
        <div className="contact-card-premium ws-card slide-up">
          <div className="card-icon-wrapper">
            <span className="card-icon">💬</span>
          </div>
          <h3>WhatsApp Directo</h3>
          <p>Ideal para consultas rápidas y agendar citas de forma inmediata.</p>
          {contacto.whatsapp && (
            <a 
              href={`https://wa.me/${contacto.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-action-premium ws-btn"
            >
              Chatear ahora
            </a>
          )}
        </div>

        {/* Card Teléfono */}
        <div className="contact-card-premium phone-card slide-up delay-1">
          <div className="card-icon-wrapper">
            <span className="card-icon">📞</span>
          </div>
          <h3>Llamada Directa</h3>
          <p>Atención personalizada para emergencias y seguimiento médico.</p>
          <span className="contact-data-highlight">{contacto.telefono || "No disponible"}</span>
        </div>

        {/* Card Email */}
        <div className="contact-card-premium email-card slide-up delay-2">
          <div className="card-icon-wrapper">
            <span className="card-icon">✉️</span>
          </div>
          <h3>Correo Electrónico</h3>
          <p>Envíanos estudios previos, resultados o dudas detalladas.</p>
          <a href={`mailto:${contacto.email}`} className="contact-link-highlight">
            {contacto.email || "No disponible"}
          </a>
        </div>

        {/* Card Horario */}
        <div className="contact-card-premium clock-card slide-up delay-3">
          <div className="card-icon-wrapper">
            <span className="card-icon">🕒</span>
          </div>
          <h3>Horario de Consulta</h3>
          <p>Organiza tu visita dentro de nuestro horario de atención.</p>
          <span className="contact-data-highlight">{contacto.horarioAtencion || "Consultar disponibilidad"}</span>
        </div>
      </div>

      {/* Footer Redes Sociales */}
      <footer className="social-footer-section slide-up delay-4">
        <div className="social-content">
          <h2>Nuestra Comunidad Digital</h2>
          <p>Mantente informado sobre consejos de salud cardiovascular pediátrica.</p>
          <div className="social-buttons-grid">
            {contacto.facebook && (
              <a href={contacto.facebook} target="_blank" rel="noopener noreferrer" className="social-btn fb-style">
                <span className="s-icon">📘</span> Facebook
              </a>
            )}
            {contacto.instagram && (
              <a href={contacto.instagram} target="_blank" rel="noopener noreferrer" className="social-btn ig-style">
                <span className="s-icon">📸</span> Instagram
              </a>
            )}
            {contacto.tiktok && (
              <a href={contacto.tiktok} target="_blank" rel="noopener noreferrer" className="social-btn tk-style">
                <span className="s-icon">🎵</span> TikTok
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}