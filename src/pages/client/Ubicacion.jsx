import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "./Ubicacion.css";

export default function Ubicacion() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUbicacion = async () => {
      const docSnap = await getDoc(doc(db, "configuracion", "ubicacion"));
      if (docSnap.exists()) {
        setPosition(docSnap.data());
      }
      setLoading(false);
    };
    fetchUbicacion();
  }, []);

  if (loading) return <div className="loading-map">Cargando ubicación...</div>;

  return (
    <div className="ubicacion-container">
      <h1>📍 Nuestra Ubicación</h1>
      <p>Visítanos en nuestra oficina principal.</p>

      {position ? (
        <div className="map-view">
          <MapContainer center={[position.lat, position.lng]} zoom={16} scrollWheelZoom={false} style={{ height: "450px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[position.lat, position.lng]}>
              <Popup>
                <strong>Consultorio PerfilMed</strong><br />
                ¡Aquí estamos!
              </Popup>
            </Marker>
          </MapContainer>
          
          <div className="map-footer">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-google-maps"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      ) : (
        <div className="no-map">
          <p>⚠️ La ubicación aún no ha sido registrada por el administrador.</p>
        </div>
      )}
    </div>
  );
}