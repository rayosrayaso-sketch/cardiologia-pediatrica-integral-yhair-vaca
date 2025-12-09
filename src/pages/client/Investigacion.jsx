import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import "./Investigacion.css";

export default function Investigacion() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const q = query(collection(db, "investigacion"), orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        setArticulos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        // Fallback si falla el ordenamiento
        const querySnapshot = await getDocs(collection(db, "investigacion"));
        setArticulos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  if (loading) return <div className="loading-blog">Cargando investigaciones...</div>;

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>🔬 Investigación y Noticias Médicas</h1>
        <p>Mantente informado con los últimos avances y consejos de salud.</p>
      </header>

      {articulos.length === 0 ? (
        <div className="empty-state">
          <p>Aún no hay artículos publicados. Vuelve pronto.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {articulos.map((articulo) => (
            <article key={articulo.id} className="blog-card">
              <div className="blog-content">
                <span className="blog-date">{articulo.fechaLegible || "Reciente"}</span>
                <h2>{articulo.titulo}</h2>
                <p>{articulo.contenido}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}