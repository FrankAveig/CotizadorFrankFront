export const validateQuoteForm = (values) => {
  const errors = {};

  if (!values.clientId) {
    errors.clientId = 'El cliente es obligatorio';
  }

  if (!values.title || !values.title.trim()) {
    errors.title = 'El título es obligatorio';
  }

  const tr = Number(values.taxRate);
  if (values.taxRate !== '' && values.taxRate != null) {
    if (Number.isNaN(tr)) {
      errors.taxRate = 'Ingresa un porcentaje válido';
    } else if (tr < 0 || tr > 100) {
      errors.taxRate = 'La tasa de impuesto debe estar entre 0 y 100';
    }
  }

  if (!values.items || values.items.length === 0) {
    errors.items = 'Debe agregar al menos un ítem';
  } else {
    values.items.forEach((item, index) => {
      if (!item.title || !item.title.trim()) {
        errors[`items[${index}].title`] = 'El título del ítem es obligatorio';
      }

      const qty = Number(item.quantity);
      if (!qty || qty <= 0) {
        errors[`items[${index}].quantity`] = 'La cantidad debe ser mayor a 0';
      }

      const price = Number(item.unitPrice);
      if (price === undefined || price === null || isNaN(price) || price < 0) {
        errors[`items[${index}].unitPrice`] = 'El precio debe ser mayor o igual a 0';
      }
    });
  }

  return errors;
};
