import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import L from "leaflet";
import "./Ubicacion.css";

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Ubicacion() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUbicacion = async () => {
      try {
        const docSnap = await getDoc(doc(db, "configuracion", "ubicacion"));
        if (docSnap.exists()) {
          setPosition(docSnap.data());
        }
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUbicacion();
  }, []);

  if (loading) {
    return (
      <div className="loading-map-container">
        <div className="medical-spinner"></div>
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="ubicacion-view fade-in">
      <div className="ubicacion-wrapper-large">
        <header className="ubicacion-header-main">
          <span className="location-tag">Ubicación Estratégica</span>
          <h1>Encuentra nuestro Consultorio</h1>
          <p>Atención especializada en Cardiología Pediátrica a tu alcance.</p>
        </header>

        <div className="location-grid-premium">
          {/* PANEL DE INFORMACIÓN */}
          <aside className="details-panel">
            <div className="contact-cards-container">
              <div className="contact-card-mini">
                <span className="mini-icon">📍</span>
                <div>
                  <strong>Dirección Exacta</strong>
                  <p>Consultorio PerfilMed, Dr. Alexander Yhair Vaca S.</p>
                </div>
              </div>
              
              <div className="contact-card-mini">
                <span className="mini-icon">📞</span>
                <div>
                  <strong>Citas y Urgencias</strong>
                  <p>Atención personalizada con tecnología avanzada.</p>
                </div>
              </div>
            </div>

            {position && (
              <div className="gps-action-box">
                <p>¿Vienes manejando?</p>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-gps-large"
                >
                  🚀 Iniciar navegación GPS
                </a>
              </div>
            )}
          </aside>

          {/* PANEL DEL MAPA (MÁS GRANDE) */}
          <main className="map-panel-large">
            {position ? (
              <div className="map-frame-premium">
                <MapContainer 
                  center={[position.lat, position.lng]} 
                  zoom={17} 
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker position={[position.lat, position.lng]} icon={redIcon}>
                    <Popup>
                      <div className="popup-pro">
                        <strong>Dr. Alexander Yhair Vaca</strong>
                        <p>Especialista en Cardiología Pediátrica</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="error-map-box">
                <p>⚠️ Ubicación no disponible en este momento.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}