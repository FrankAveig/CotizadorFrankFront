export function validateProfileForm(values) {
  const errors = {};
  if (values.contactName !== undefined && !values.contactName.trim()) {
    errors.contactName = 'El nombre de contacto no puede estar vacío';
  }
  if (values.phone !== undefined && !values.phone.trim()) {
    errors.phone = 'El teléfono no puede estar vacío';
  }
  return errors;
}
