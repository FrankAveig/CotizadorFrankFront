const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePortalLoginForm(values) {
  const errors = {};
  if (!values.email || !values.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido';
  }
  if (!values.password || !values.password.trim()) {
    errors.password = 'La contraseña es obligatoria';
  }
  return errors;
}
