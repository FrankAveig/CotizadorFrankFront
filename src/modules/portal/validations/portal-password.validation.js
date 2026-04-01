export function validateChangePassword(values) {
  const errors = {};
  if (!values.currentPassword || !values.currentPassword.trim()) {
    errors.currentPassword = 'La contraseña actual es obligatoria';
  }
  if (!values.newPassword || !values.newPassword.trim()) {
    errors.newPassword = 'La nueva contraseña es obligatoria';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres';
  }
  return errors;
}
