import React, { useState, memo } from 'react';
import { useAuth } from '../hooks';
import { Lock } from 'lucide-react';

const Login = memo(() => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, pass);
    if (!success) setError(true);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="glass-card login-card">
        <div className="login-icon">
          <Lock size={30} />
        </div>
        <h2 className="login-title">Acceso Restringido</h2>
        <p className="login-subtitle">Ingresa tus credenciales para administrar el sitio.</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); setError(false); }}
            className={`login-input ${error ? 'login-input--error' : ''}`}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={pass} 
            onChange={(e) => { setPass(e.target.value); setError(false); }}
            className={`login-input ${error ? 'login-input--error' : ''}`}
            required
          />
          {error && <span className="login-error">Credenciales incorrectas</span>}
          <button type="submit" disabled={loading} className="btn-primary login-btn" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Verificando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
