import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Curriculum.css";

export default function Curriculum() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN DE CONVERSIÓN (Lógica Thumbnail que funciona) ---
  const convertirLinkDrive = (url) => {
    if (!url) return "";
    
    if (url.includes("drive.google.com") && url.includes("/file/d/")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Usamos thumbnail HD para garantizar visualización
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }
    return url;
  };

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const docRef = doc(db, "configuracion", "curriculum");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCvData(docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  if (loading) return <div className="loading-cv">
    <div className="spinner"></div>
    <p>Cargando perfil profesional...</p>
  </div>;

  if (!cvData) {
    return (
      <div className="cv-container">
        <div className="cv-card empty fade-in">
          <h2>Perfil Profesional</h2>
          <p>La información del profesional aún no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-container fade-in">
      <div className="cv-card">
        {/* Decoración visual de fondo en el header */}
        <div className="cv-card-banner"></div>

        <header className="cv-header">
          
          {/* FOTO DE PERFIL CON DISEÑO PROFESIONAL */}
          {cvData.foto && (
            <div className="profile-image-wrapper pop-in">
              <img 
                src={convertirLinkDrive(cvData.foto)} 
                alt="Dr. Alexander Yhair Vaca" 
                className="profile-image"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src="https://placehold.co/150?text=Dr.+Alexander";
                }}
              />
            </div>
          )}

          <div className="header-text slide-up">
            <h1>Dr. Alexander Yhair Vaca Saldaña</h1>
            <p className="subtitle">Especialista en Cardiología Pediátrica Integral</p>
            <div className="divider"></div>
          </div>
        </header>

        <div className="cv-body slide-up delay-1">
          <section className="cv-section bio-section">
            <h3>
              <span className="icon-circle">👨‍⚕️</span> 
              Perfil Profesional
            </h3>
            <div className="text-content">
              <p>{cvData.descripcion || "Sin descripción disponible."}</p>
            </div>
          </section>

          {/* --- SECCIÓN: MISIÓN Y VISIÓN (Diseño de Tarjetas) --- */}
          {(cvData.mision || cvData.vision) && (
            <div className="mision-vision-grid">
              {cvData.mision && (
                <div className="mv-card mision pop-in delay-2">
                  <div className="mv-icon">🚀</div>
                  <h3>Misión</h3>
                  <p>{cvData.mision}</p>
                </div>
              )}
              {cvData.vision && (
                <div className="mv-card vision pop-in delay-3">
                  <div className="mv-icon">👁️</div>
                  <h3>Visión</h3>
                  <p>{cvData.vision}</p>
                </div>
              )}
            </div>
          )}

          <section className="cv-section experience-section mt-4">
            <h3>
              <span className="icon-circle">🏥</span> 
              Experiencia y Logros
            </h3>
            <div className="text-content">
              <p>{cvData.experiencia || "Información pendiente de actualizar."}</p>
            </div>
          </section>
        </div>

        {cvData.enlace && (
          <div className="cv-footer slide-up delay-2">
            <a 
              href={cvData.enlace} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-download-cv"
            >
              <span className="btn-icon">📄</span> Descargar Currículum Vitae
            </a>
          </div>
        )}
      </div>
    </div>
  );
}