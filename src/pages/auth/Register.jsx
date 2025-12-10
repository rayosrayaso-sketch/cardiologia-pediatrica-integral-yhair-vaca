import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./Login.css"; // Reutilizamos los estilos del Login (Wide Card)

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Crear usuario en Auth
      const credencialUsuario = await signup(email, password);
      const user = credencialUsuario.user;

      // 2. Guardar datos en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        nombre: nombre,
        telefono: telefono,
        rol: "cliente",
        creadoEn: new Date()
      });

      // Alerta de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Cuenta Creada!',
        text: 'Te has registrado correctamente. Bienvenido a PerfilMed.',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745'
      }).then(() => {
        navigate("/");
      });

    } catch (err) {
      console.error(err);
      let msg = "No se pudo crear la cuenta.";
      if (err.code === "auth/email-already-in-use") msg = "Este correo ya está registrado.";
      else if (err.code === "auth/weak-password") msg = "La contraseña es muy débil (mínimo 6 caracteres).";

      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: msg,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Usamos la misma estructura de tarjeta ancha que en el Login */}
      <div className="login-card-wide fade-in-up">
        
        {/* SECCIÓN IZQUIERDA: BRANDING MÉDICO (Idéntico al Login para consistencia) */}
        <div className="login-branding">
          <div className="heart-icon-wrapper">
            <span className="heart-icon">❤️</span>
          </div>
          <h1>PerfilMed</h1>
          <p className="branding-subtitle">Dra. Alexander Yhair Vaca Saldaña</p>
          <div className="branding-divider"></div>
          <p className="branding-desc">
            Únete a nuestra comunidad de pacientes y lleva el control de tu salud cardiovascular con la mejor atención.
          </p>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO DE REGISTRO */}
        <div className="login-form-wrapper">
          <div className="form-header">
            <h2>Crear Cuenta</h2>
            <span className="subtitle">Completa tus datos para agendar citas</span>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            
            {/* Campo Nombre */}
            <div className="form-group slide-in-right delay-1">
              <label>Nombre Completo</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="text" 
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Campo Teléfono */}
            <div className="form-group slide-in-right delay-1">
              <label>Teléfono / Celular</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="tel" 
                  placeholder="Ej. 70123456"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="form-group slide-in-right delay-2">
              <label>Correo Electrónico</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="email" 
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="form-group slide-in-right delay-2">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <span className="input-icon"></span>
                <input 
                  type="password" 
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary-cardio pulse-on-hover" disabled={isSubmitting}>
              {isSubmitting ? <div className="spinner"></div> : "Registrarse"}
            </button>
          </form>

          <p className="toggle-text slide-in-right delay-3">
            ¿Ya tienes cuenta?
            <Link to="/login" className="btn-link-cardio">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}