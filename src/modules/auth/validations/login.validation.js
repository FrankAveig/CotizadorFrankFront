const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email || !values.email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido';
  }

  if (!values.password || !values.password.trim()) {
    errors.password = 'La contraseña es requerida';
  }

  return errors;
}
