import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      
      Toast.fire({
        icon: 'success',
        title: '¡Bienvenido de nuevo!'
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      let mensajeError = "Ocurrió un error al intentar ingresar.";
      
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        mensajeError = "Correo electrónico o contraseña incorrectos.";
      } else if (err.code === "auth/too-many-requests") {
        mensajeError = "Demasiados intentos fallidos. Intenta más tarde.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: mensajeError,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Diseño de Tarjeta Ancha (Alargada) */}
      <div className="login-card-wide fade-in-up">
        
        {/* SECCIÓN IZQUIERDA: BRANDING MÉDICO */}
        <div className="login-branding">
          <div className="heart-icon-wrapper">
            <span className="heart-icon">❤️</span>
          </div>
          <h1>PerfilMed</h1>
          <p className="branding-subtitle">Dr. Yhair Alexander Vaca Saldaña</p>
          <div className="branding-divider"></div>
          <p className="branding-desc">
            Cuidando el corazón de tus seres queridos con atención integral y profesionalismo.
          </p>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO */}
        <div className="login-form-wrapper">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <span className="subtitle">Accede a tu historial y agenda</span>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group slide-in-right delay-1">
              <label>Correo Electrónico</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="email" 
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group slide-in-right delay-2">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary-cardio pulse-on-hover" disabled={isSubmitting}>
              {isSubmitting ? <div className="spinner"></div> : "Ingresar al Sistema"}
            </button>
          </form>

          <p className="toggle-text slide-in-right delay-3">
            ¿Paciente nuevo?
            <Link to="/register" className="btn-link-cardio">Crear Historia Clínica</Link>
          </p>
        </div>

      </div>
    </div>
  );
}