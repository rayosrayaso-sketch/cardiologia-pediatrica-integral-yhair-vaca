import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import "../admin/Admin.css"; // Usa los mismos estilos del dashboard

export default function GestionCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    setLoading(true);
    // Consulta las citas ordenadas por fecha de creación (más recientes primero)
    const q = query(collection(db, "citas"), orderBy("creadoEn", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedCitas = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setCitas(fetchedCitas);
    setLoading(false);
  };

  const cambiarEstadoCita = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "citas", id), {
        estado: nuevoEstado
      });
      // Actualizar el estado local para reflejar el cambio en la UI
      setCitas(citas.map(cita => 
        cita.id === id ? { ...cita, estado: nuevoEstado } : cita
      ));
      alert(`Cita ${nuevoEstado} con éxito.`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const getEstadoClass = (estado) => {
    if (estado === 'confirmada') return 'status-confirmada';
    if (estado === 'cancelada') return 'status-cancelada';
    return 'status-pendiente';
  };

  if (loading) return <div className="loading-admin">Cargando citas...</div>;

  return (
    <div className="admin-container">
      <h1>📅 Gestión de Citas Agendadas</h1>
      <p>Administra las reservas de tus pacientes.</p>

      {citas.length === 0 ? (
        <p>No hay citas agendadas.</p>
      ) : (
        <div className="citas-list">
          {citas.map((cita) => (
            <div key={cita.id} className="cita-item">
              <div>
                <span className={`cita-status ${getEstadoClass(cita.estado)}`}>{cita.estado.toUpperCase()}</span>
                <h3>Servicio: {cita.servicio}</h3>
                <p>Paciente: <strong>{cita.userEmail}</strong></p>
                <p>Fecha/Hora: <strong>{cita.fecha}</strong> a las <strong>{cita.hora}</strong></p>
              </div>
              
              <div className="cita-actions">
                {cita.estado !== 'confirmada' && (
                  <button onClick={() => cambiarEstadoCita(cita.id, 'confirmada')} className="btn-confirmar">Confirmar</button>
                )}
                {cita.estado !== 'cancelada' && (
                  <button onClick={() => cambiarEstadoCita(cita.id, 'cancelada')} className="btn-cancelar">Cancelar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}