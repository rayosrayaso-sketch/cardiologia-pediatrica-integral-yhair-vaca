import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Estilos opcionales

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await signup(email, password);
        // Podrías agregar aquí una lógica para guardar datos extra del usuario en Firestore si quisieras
        alert("Usuario registrado con éxito. ¡Bienvenido!");
        navigate("/");
      } else {
        await login(email, password);
        // La redirección la maneja el AuthContext o el useEffect en App, 
        // pero por seguridad forzamos navegación al home tras login exitoso.
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? "Registro de Paciente" : "Ingreso al Sistema"}</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary">
            {isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegistering ? "¿Ya tienes cuenta?" : "¿Nuevo usuario?"}
          <button 
            className="btn-link" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? " Inicia sesión aquí" : " Regístrate aquí"}
          </button>
        </p>
      </div>
    </div>
  );
}