import React, { useState, memo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

const Login = memo(() => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const isLocked = lockout || attempts >= MAX_ATTEMPTS;

  const startLockout = () => {
    setLockout(true);
    let remaining = LOCKOUT_SECONDS;
    setLockoutTimer(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      setLockoutTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setLockout(false);
        setAttempts(0);
        setLockoutTimer(0);
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    const success = await login(email, pass);

    if (!success) {
      setError(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        startLockout();
      }
    } else {
      setError(false);
      setAttempts(0);
    }
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
            disabled={isLocked}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(false); }}
            className={`login-input ${error ? 'login-input--error' : ''}`}
            disabled={isLocked}
            required
          />
          {error && !isLocked && <span className="login-error">Credenciales incorrectas</span>}
          {attempts > 0 && !isLocked && (
            <span className="login-error" style={{ color: '#f59e0b' }}>
              Intentos restantes: {MAX_ATTEMPTS - attempts}
            </span>
          )}
          {isLocked && (
            <span className="login-error" style={{ color: '#ef4444' }}>
              Formulario bloqueado. Espera {lockoutTimer}s para reintentar.
            </span>
          )}
          <button type="submit" disabled={loading || isLocked} className="btn-primary login-btn" style={{ opacity: loading || isLocked ? 0.7 : 1 }}>
            {isLocked ? `Bloqueado (${lockoutTimer}s)` : loading ? 'Verificando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
