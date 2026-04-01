export function validatePaymentForm(values) {
  const errors = {};

  if (!values.projectId) {
    errors.projectId = 'El proyecto es requerido.';
  }

  if (!values.amount && values.amount !== 0) {
    errors.amount = 'El monto es requerido.';
  } else if (parseFloat(values.amount) <= 0) {
    errors.amount = 'El monto debe ser mayor a 0.';
  }

  if (!values.paymentDate) {
    errors.paymentDate = 'La fecha de pago es requerida.';
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = 'El método de pago es requerido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
