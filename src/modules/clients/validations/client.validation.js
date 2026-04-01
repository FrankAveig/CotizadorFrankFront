const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClientForm = (values) => {
  const errors = {};

  if (!values.businessName || !values.businessName.trim()) {
    errors.businessName = 'La razón social es obligatoria';
  }

  if (!values.contactName || !values.contactName.trim()) {
    errors.contactName = 'El nombre de contacto es obligatorio';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido';
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = 'El teléfono es obligatorio';
  }

  return errors;
};
