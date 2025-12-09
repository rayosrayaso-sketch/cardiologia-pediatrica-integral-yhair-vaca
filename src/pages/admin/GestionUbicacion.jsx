import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { db } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./GestionUbicacion.css";

// Componente para detectar clics en el mapa
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
}

export default function GestionUbicacion() {
  // Coordenadas iniciales (ej. Tarija, Bolivia)
  const defaultCenter = [-21.5355, -64.7296]; 
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar ubicación guardada
  useEffect(() => {
    const fetchUbicacion = async () => {
      const docRef = doc(db, "configuracion", "ubicacion");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPosition({ lat: data.lat, lng: data.lng });
      }
      setLoading(false);
    };
    fetchUbicacion();
  }, []);

  // Guardar en Firebase
  const guardarUbicacion = async () => {
    if (!position) return alert("Selecciona una ubicación en el mapa primero.");
    try {
      await setDoc(doc(db, "configuracion", "ubicacion"), {
        lat: position.lat,
        lng: position.lng
      });
      alert("¡Ubicación de la oficina actualizada!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar ubicación");
    }
  };

  if (loading) return <p>Cargando mapa...</p>;

  return (
    <div className="map-admin-container">
      <h1>📍 Gestión de Ubicación</h1>
      <p>Haz clic en el mapa para marcar dónde se encuentra tu consultorio.</p>
      
      <div className="map-wrapper">
        <MapContainer center={position || defaultCenter} zoom={15} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <div className="coords-info">
        {position ? (
          <p>Seleccionado: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</p>
        ) : (
          <p>No se ha seleccionado ninguna ubicación.</p>
        )}
        <button onClick={guardarUbicacion} className="btn-save-map">Guardar Ubicación</button>
      </div>
    </div>
  );
}