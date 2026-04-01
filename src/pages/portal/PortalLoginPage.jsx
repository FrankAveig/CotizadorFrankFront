import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuth } from '../../context/ClientAuthContext';
import PasswordField from '../../components/ui/PasswordField';
import { validatePortalLoginForm } from '../../modules/portal/validations/portal-login.validation';
import styles from './PortalLoginPage.module.css';

export default function PortalLoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useClientAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/portal', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePortalLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await login(values.email.trim(), values.password);
      navigate('/portal', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales inválidas. Intente de nuevo.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brand}>
     
          <h1 className={styles.brandTitle}>Portal de Clientes</h1>
          <p className={styles.brandSubtitle}>Acceda a sus cotizaciones, proyectos y documentos</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.formTitle}>Iniciar Sesión</h2>

          {apiError && <div className={styles.apiError}>{apiError}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="ejemplo@correo.com"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <PasswordField
              id="password"
              name="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <span className={styles.buttonContent}>
                <span className={styles.spinner} />
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
