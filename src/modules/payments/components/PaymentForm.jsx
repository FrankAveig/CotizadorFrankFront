import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import { PAYMENT_METHODS } from '../../../core/constants/statuses';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import { validatePaymentForm } from '../validations/payment.validation';
import styles from './PaymentForm.module.css';

const METHOD_OPTIONS = Object.values(PAYMENT_METHODS).map((m) => ({
  value: m.value,
  label: m.label,
}));

export default function PaymentForm({
  onSubmit,
  loading = false,
  projectId,
  maxAmount,
}) {
  const [form, setForm] = useState({
    projectId: projectId || '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validatePaymentForm(form);

    if (maxAmount != null && parseFloat(form.amount) > parseFloat(maxAmount)) {
      validationErrors.amount = `El monto no puede exceder ${formatCurrency(maxAmount)}.`;
    }

    const hasErrors = !isValid || Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      projectId: Number(form.projectId),
      amount: parseFloat(form.amount),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      reference: form.reference || undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {maxAmount != null && (
        <div className={styles.helper}>
          Monto máximo disponible:{' '}
          <strong>{formatCurrency(maxAmount)}</strong>
        </div>
      )}

      <div className={styles.grid}>
        <Input
          label="Monto"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.amount}
          required
        />

        <Input
          label="Fecha de pago"
          name="paymentDate"
          type="date"
          value={form.paymentDate}
          onChange={handleChange}
          error={errors.paymentDate}
          required
        />

        <Select
          label="Método de pago"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          options={METHOD_OPTIONS}
          placeholder="Seleccionar método"
          error={errors.paymentMethod}
          required
        />

        <Input
          label="Referencia"
          name="reference"
          value={form.reference}
          onChange={handleChange}
          placeholder="Nro. de transacción, comprobante, etc."
        />
      </div>

      <TextArea
        label="Notas"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notas adicionales sobre el pago..."
        rows={3}
      />

      <div className={styles.actions}>
        <Button type="submit" loading={loading} disabled={loading}>
          Registrar Pago
        </Button>
      </div>
    </form>
  );
}
