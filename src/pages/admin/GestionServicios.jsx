import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2"; // Importamos SweetAlert2
import "./GestionServicios.css";

export default function GestionServicios() {
  const [servicios, setServicios] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", precio: "", duracion: "30" });
  const [horario, setHorario] = useState({ entrada: "08:00", salida: "18:00", dias: "Lunes a Sábado" });
  const [loading, setLoading] = useState(true);

  // Referencias a colecciones
  const serviciosCollection = collection(db, "servicios");
  const configDocRef = doc(db, "configuracion", "horarioGeneral");

  // 1. Cargar datos al iniciar
  useEffect(() => {
    const obtenerDatos = async () => {
      // Cargar servicios
      const data = await getDocs(serviciosCollection);
      setServicios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      // Cargar horario guardado
      const horarioSnap = await getDoc(configDocRef);
      if (horarioSnap.exists()) {
        setHorario(horarioSnap.data());
      }
      setLoading(false);
    };
    obtenerDatos();
  }, []);

  // 2. Función para agregar servicio
  const agregarServicio = async (e) => {
    e.preventDefault();
    if (!nuevoServicio.nombre || !nuevoServicio.precio) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor ingresa el nombre y el precio del servicio.',
        confirmButtonColor: '#0ea5e9'
      });
    }

    try {
      const docRef = await addDoc(serviciosCollection, nuevoServicio);
      setServicios([...servicios, { ...nuevoServicio, id: docRef.id }]);
      setNuevoServicio({ nombre: "", precio: "", duracion: "30" }); // Limpiar form
      
      Swal.fire({
        icon: 'success',
        title: '¡Servicio Agregado!',
        text: 'El servicio se ha registrado correctamente en el sistema.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el servicio.',
      });
    }
  };

  // 3. Función para eliminar servicio
  const eliminarServicio = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar servicio?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo alerta
      cancelButtonColor: '#64748b', // Gris cancelar
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "servicios", id));
        setServicios(servicios.filter(s => s.id !== id));
        Swal.fire(
          '¡Eliminado!',
          'El servicio ha sido eliminado de la lista.',
          'success'
        );
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
      }
    }
  };

  // 4. Función para guardar horario
  const guardarHorario = async () => {
    try {
      await setDoc(configDocRef, horario);
      Swal.fire({
        icon: 'success',
        title: 'Horario Actualizado',
        text: 'La configuración de atención ha sido guardada.',
        confirmButtonColor: '#0ea5e9'
      });
    } catch (error) {
      console.error("Error al guardar horario:", error);
      Swal.fire('Error', 'No se pudo actualizar el horario', 'error');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div>Cargando panel...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header fade-in-down">
        <h1>Gestión de Servicios y Agenda</h1>
        <p>Configura tu disponibilidad y catálogo de consultas</p>
      </header>

      {/* SECCIÓN 1: CONFIGURAR HORARIO */}
      <section className="card-admin section-horario fade-in-up delay-1">
        <div className="card-header">
          <h2>🕒 Configuración de Horario</h2>
        </div>
        <div className="card-body">
          <div className="form-horario">
            <div className="input-group">
              <label>Hora de Apertura</label>
              <input 
                type="time" 
                value={horario.entrada} 
                onChange={e => setHorario({ ...horario, entrada: e.target.value })} 
              />
            </div>
            <div className="input-group">
              <label>Hora de Cierre</label>
              <input 
                type="time" 
                value={horario.salida} 
                onChange={e => setHorario({ ...horario, salida: e.target.value })} 
              />
            </div>
            <button onClick={guardarHorario} className="btn-save">
              Actualizar Horario
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: AGREGAR SERVICIOS */}
      <section className="card-admin section-agregar fade-in-up delay-2">
        <div className="card-header">
          <h2>➕ Agregar Nuevo Servicio</h2>
        </div>
        <div className="card-body">
          <form onSubmit={agregarServicio} className="form-servicio">
            <input
              type="text"
              className="input-text"
              placeholder="Nombre del servicio (ej. Consulta General)"
              value={nuevoServicio.nombre}
              onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
            />
            <div className="row-inputs">
              <input
                type="number"
                className="input-number"
                placeholder="Costo (Bs)"
                value={nuevoServicio.precio}
                onChange={e => setNuevoServicio({ ...nuevoServicio, precio: e.target.value })}
              />
              <select
                className="input-select"
                value={nuevoServicio.duracion}
                onChange={e => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hora</option>
              </select>
            </div>
            <button type="submit" className="btn-add">Agregar Servicio</button>
          </form>
        </div>
      </section>

      {/* SECCIÓN 3: LISTA DE SERVICIOS */}
      <section className="lista-servicios fade-in-up delay-3">
        <h2>📋 Servicios Activos</h2>
        {servicios.length === 0 ? (
          <div className="empty-state">No hay servicios registrados actualmente.</div>
        ) : (
          <div className="grid-servicios">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="servicio-item scale-in">
                <div className="servicio-info">
                  <h3>{servicio.nombre}</h3>
                  <div className="servicio-detalles">
                    <span className="tag-precio">{servicio.precio} Bs</span>
                    <span className="tag-duracion">⏱ {servicio.duracion} min</span>
                  </div>
                </div>
                <button onClick={() => eliminarServicio(servicio.id)} className="btn-delete">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}