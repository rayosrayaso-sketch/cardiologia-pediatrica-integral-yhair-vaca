import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import "./GestionServicios.css"; // Crearemos estilos básicos luego

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
    if (!nuevoServicio.nombre || !nuevoServicio.precio) return alert("Completa todos los campos");

    try {
      const docRef = await addDoc(serviciosCollection, nuevoServicio);
      setServicios([...servicios, { ...nuevoServicio, id: docRef.id }]);
      setNuevoServicio({ nombre: "", precio: "", duracion: "30" }); // Limpiar form
      alert("Servicio agregado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // 3. Función para eliminar servicio
  const eliminarServicio = async (id) => {
    if(!confirm("¿Seguro que deseas eliminar este servicio?")) return;
    await deleteDoc(doc(db, "servicios", id));
    setServicios(servicios.filter(s => s.id !== id));
  };

  // 4. Función para guardar horario
  const guardarHorario = async () => {
    try {
      await setDoc(configDocRef, horario);
      alert("Horario de atención actualizado");
    } catch (error) {
      console.error("Error al guardar horario:", error);
    }
  };

  if (loading) return <div className="loading">Cargando panel...</div>;

  return (
    <div className="admin-container">
      <h1>Gestión de Servicios y Agenda</h1>

      {/* SECCIÓN 1: CONFIGURAR HORARIO */}
      <section className="card-admin">
        <h2>🕒 Configuración de Horario</h2>
        <div className="form-horario">
          <label>
            Hora de Apertura:
            <input type="time" value={horario.entrada} onChange={e => setHorario({...horario, entrada: e.target.value})} />
          </label>
          <label>
            Hora de Cierre:
            <input type="time" value={horario.salida} onChange={e => setHorario({...horario, salida: e.target.value})} />
          </label>
          <button onClick={guardarHorario} className="btn-save">Actualizar Horario</button>
        </div>
      </section>

      {/* SECCIÓN 2: AGREGAR SERVICIOS */}
      <section className="card-admin">
        <h2>➕ Agregar Nuevo Servicio</h2>
        <form onSubmit={agregarServicio} className="form-servicio">
          <input 
            type="text" 
            placeholder="Nombre del servicio (ej. Consulta General)" 
            value={nuevoServicio.nombre}
            onChange={e => setNuevoServicio({...nuevoServicio, nombre: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Costo (Bs)" 
            value={nuevoServicio.precio}
            onChange={e => setNuevoServicio({...nuevoServicio, precio: e.target.value})}
          />
          <select 
            value={nuevoServicio.duracion} 
            onChange={e => setNuevoServicio({...nuevoServicio, duracion: e.target.value})}
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">1 hora</option>
          </select>
          <button type="submit" className="btn-add">Agregar Servicio</button>
        </form>
      </section>

      {/* SECCIÓN 3: LISTA DE SERVICIOS */}
      <section className="lista-servicios">
        <h2>📋 Servicios Activos</h2>
        {servicios.length === 0 ? <p>No hay servicios registrados.</p> : (
          <div className="grid-servicios">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="servicio-item">
                <h3>{servicio.nombre}</h3>
                <p>Precio: <strong>{servicio.precio} Bs</strong></p>
                <p>Duración: {servicio.duracion} min</p>
                <button onClick={() => eliminarServicio(servicio.id)} className="btn-delete">Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}