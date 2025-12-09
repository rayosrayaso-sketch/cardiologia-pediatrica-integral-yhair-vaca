import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore";
import "./GestionInvestigacion.css"; // Crearemos estos estilos abajo

export default function GestionInvestigacion() {
  const [articulos, setArticulos] = useState([]);
  const [nuevoArticulo, setNuevoArticulo] = useState({ titulo: "", contenido: "" });
  const [loading, setLoading] = useState(true);

  const articulosRef = collection(db, "investigacion");

  // 1. Cargar artículos ordenados por fecha
  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    // Nota: Para ordenar por timestamp 'desc', a veces Firebase pide crear un índice. 
    // Si te da error en consola, usa el link que te dará Firebase o quita el orderBy temporalmente.
    try {
      const q = query(articulosRef, orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setArticulos(docs);
    } catch (error) {
      console.warn("Posible falta de índice o error de red, cargando sin orden estricto:", error);
      const querySnapshot = await getDocs(articulosRef);
      const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setArticulos(docs);
    } finally {
      setLoading(false);
    }
  };

  // 2. Publicar nuevo artículo
  const publicarArticulo = async (e) => {
    e.preventDefault();
    if (!nuevoArticulo.titulo || !nuevoArticulo.contenido) return alert("Completa todos los campos");

    try {
      await addDoc(articulosRef, {
        ...nuevoArticulo,
        fecha: serverTimestamp(), // Fecha automática del servidor
        fechaLegible: new Date().toLocaleDateString() // Para mostrar fácil sin procesar timestamp
      });
      setNuevoArticulo({ titulo: "", contenido: "" });
      fetchArticulos(); // Recargar lista
      alert("Artículo publicado correctamente");
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  // 3. Eliminar artículo
  const eliminarArticulo = async (id) => {
    if(!confirm("¿Borrar este artículo permanentemente?")) return;
    try {
      await deleteDoc(doc(db, "investigacion", id));
      setArticulos(articulos.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <div className="loading-admin">Cargando noticias...</div>;

  return (
    <div className="admin-container">
      <h1>📰 Gestión de Investigación y Noticias</h1>
      <p>Publica novedades médicas, consejos o resultados de investigaciones para tus pacientes.</p>

      {/* FORMULARIO DE PUBLICACIÓN */}
      <section className="card-admin form-section">
        <h2>✍️ Nueva Publicación</h2>
        <form onSubmit={publicarArticulo}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Título del artículo (Ej. Avances en Cardiología)" 
              value={nuevoArticulo.titulo}
              onChange={e => setNuevoArticulo({...nuevoArticulo, titulo: e.target.value})}
              className="input-titulo"
            />
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Escribe el contenido aquí..." 
              rows="5"
              value={nuevoArticulo.contenido}
              onChange={e => setNuevoArticulo({...nuevoArticulo, contenido: e.target.value})}
              className="textarea-contenido"
            ></textarea>
          </div>
          <button type="submit" className="btn-publicar">Publicar Artículo</button>
        </form>
      </section>

      {/* LISTADO DE ARTÍCULOS */}
      <section className="lista-articulos">
        <h2>📚 Publicaciones Recientes</h2>
        {articulos.length === 0 ? <p>No hay artículos publicados.</p> : (
          <div className="grid-articulos">
            {articulos.map((art) => (
              <div key={art.id} className="articulo-admin-card">
                <div className="articulo-header">
                  <h3>{art.titulo}</h3>
                  <span className="fecha-tag">{art.fechaLegible}</span>
                </div>
                <p className="articulo-preview">{art.contenido.substring(0, 100)}...</p>
                <button onClick={() => eliminarArticulo(art.id)} className="btn-delete-art">🗑 Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}