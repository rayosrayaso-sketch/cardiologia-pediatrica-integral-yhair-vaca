// ... otros imports ...
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";

// Componentes Cliente
import Ubicacion from "./pages/client/Ubicacion"; 
import Ofertas from "./pages/client/Ofertas"; 
import Investigacion from "./pages/client/Investigacion"; // <--- Import REAL
const HomeCliente = () => <div style={{padding: '40px', textAlign: 'center'}}><h1>Bienvenido a PerfilMed</h1><p style={{fontSize: '1.2rem'}}>Su salud, nuestra prioridad.</p></div>;

// Componentes Admin
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import GestionServicios from "./pages/admin/GestionServicios"; 
import GestionUbicacion from "./pages/admin/GestionUbicacion"; 
import GestionCitas from "./pages/admin/GestionCitas"; 
import GestionInvestigacion from "./pages/admin/GestionInvestigacion"; // <--- Import REAL

// ... resto del código (RutaProtegidaAdmin, RutaPrivada, etc) ...

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* ... rutas login, home, etc ... */}
            
            {/* RUTAS CLIENTE */}
            <Route path="/" element={<HomeCliente />} />
            <Route path="/ubicacion" element={<Ubicacion />} />
            <Route path="/ofertas" element={<RutaPrivada><Ofertas /></RutaPrivada>} />
            
            {/* Aquí usamos el componente REAL */}
            <Route path="/investigacion" element={<Investigacion />} />


            {/* RUTAS ADMIN */}
            <Route path="/admin" element={<RutaProtegidaAdmin><AdminDashboard /></RutaProtegidaAdmin>} />
            <Route path="/admin/servicios" element={<RutaProtegidaAdmin><GestionServicios /></RutaProtegidaAdmin>} />
            <Route path="/admin/ubicacion" element={<RutaProtegidaAdmin><GestionUbicacion /></RutaProtegidaAdmin>} />
            <Route path="/admin/citas" element={<RutaProtegidaAdmin><GestionCitas /></RutaProtegidaAdmin>} />
            
            {/* Aquí usamos el componente REAL */}
            <Route path="/admin/investigacion" element={<RutaProtegidaAdmin><GestionInvestigacion /></RutaProtegidaAdmin>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;