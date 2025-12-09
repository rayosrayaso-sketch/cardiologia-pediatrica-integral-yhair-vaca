import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Ofertas.css"; // Estilos similares

export default function Ofertas() {
  const [servicios, setServicios] = useState([]);
  const [horario, setHorario] = useState(null);
  const [cita, setCita] = useState({ fecha: "", hora: "", servicioId: "", servicioNombre: "" });
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cargar Servicios y Horario
  useEffect(() => {
    const cargarDatos = async () => {
      const servData = await getDocs(collection(db, "servicios"));
      setServicios(servData.docs.map(d => ({ ...d.data(), id: d.id })));
      
      const configSnap = await getDoc(doc(db, "configuracion", "horarioGeneral"));
      if(configSnap.exists()) setHorario(configSnap.data());
      
      setLoading(false);
    };
    cargarDatos();
  }, []);

  // Manejar Reserva
  const reservarCita = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!cita.fecha || !cita.hora || !cita.servicioId) return alert("Selecciona fecha y hora");

    // Validación simple de horario
    if (horario) {
      if (cita.hora < horario.entrada || cita.hora > horario.salida) {
        return alert(`El doctor atiende de ${horario.entrada} a ${horario.salida}`);
      }
    }

    try {
      await addDoc(collection(db, "citas"), {
        userId: user.uid,
        userEmail: user.email,
        servicio: cita.servicioNombre,
        fecha: cita.fecha,
        hora: cita.hora,
        estado: "pendiente", // pendiente, confirmada, cancelada
        creadoEn: new Date()
      });
      alert("¡Cita reservada con éxito! El doctor se pondrá en contacto.");
      setCita({ fecha: "", hora: "", servicioId: "", servicioNombre: "" }); // Reset
    } catch (error) {
      console.error("Error al reservar:", error);
      alert("Hubo un error al reservar.");
    }
  };

  return (
    <div className="ofertas-container">
      <h1>Oferta de Servicios Médicos</h1>
      <p>Selecciona un servicio y agenda tu cita.</p>

      {/* FORMULARIO DE RESERVA FLOTANTE O EN CABECERA */}
      {cita.servicioId && (
        <div className="reserva-card">
          <h3>Reservando: {cita.servicioNombre}</h3>
          <form onSubmit={reservarCita}>
            <label>Fecha: <input type="date" required min={new Date().toISOString().split('T')[0]} onChange={e => setCita({...cita, fecha: e.target.value})} /></label>
            <label>Hora: <input type="time" required onChange={e => setCita({...cita, hora: e.target.value})} /></label>
            <div className="botones-reserva">
              <button type="submit" className="btn-confirmar">Confirmar Cita</button>
              <button type="button" onClick={() => setCita({ fecha: "", hora: "", servicioId: "", servicioNombre: "" })} className="btn-cancelar">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* GRILLA DE SERVICIOS */}
      <div className="servicios-grid">
        {servicios.map(servicio => (
          <div key={servicio.id} className="card-servicio">
            <h3>{servicio.nombre}</h3>
            <p className="precio">{servicio.precio} Bs</p>
            <p className="duracion">⏱ {servicio.duracion} min</p>
            <button 
              className="btn-agendar"
              onClick={() => setCita({ ...cita, servicioId: servicio.id, servicioNombre: servicio.nombre })}
            >
              Agendar Cita
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}