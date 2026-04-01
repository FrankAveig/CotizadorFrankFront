import { useState } from 'react';
import PasswordField from '../../../components/ui/PasswordField';
import { validateLoginForm } from '../validations/login.validation';
import styles from './LoginForm.module.css';

export default function LoginForm({ onSubmit, loading, error }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({ email: values.email.trim(), password: values.password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>

      {error && <div className={styles.apiError}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Correo electrónico
        </label>
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
        <label className={styles.label} htmlFor="password">
          Contraseña
        </label>
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

      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
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
  );
}
