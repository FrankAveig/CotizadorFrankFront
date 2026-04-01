import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import QuoteItemsEditor from './QuoteItemsEditor';
import { validateQuoteForm } from '../validations/quote.validation';
import { formatDateISO } from '../../../core/utils/formatDate';
import styles from './QuoteForm.module.css';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

const INITIAL_VALUES = {
  clientId: '',
  title: '',
  description: '',
  currency: 'USD',
  validUntil: '',
  discountAmount: 0,
  taxRate: 15,
  notes: '',
  items: [{ title: '', description: '', quantity: 1, unitPrice: 0 }],
};

const QuoteForm = ({ initialData, onSubmit, loading, clients = [] }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        currency: initialData.currency || 'USD',
        validUntil: initialData.validUntil ? formatDateISO(initialData.validUntil) : '',
        discountAmount: parseFloat(initialData.discountAmount) || 0,
        taxRate: parseFloat(initialData.taxRate) || 0,
        notes: initialData.notes || '',
        items:
          initialData.items && initialData.items.length > 0
            ? initialData.items.map((item) => ({
                title: item.title || '',
                description: item.description || '',
                quantity: parseFloat(item.quantity) || 1,
                unitPrice: parseFloat(item.unitPrice) || 0,
              }))
            : [{ title: '', description: '', quantity: 1, unitPrice: 0 }],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleItemsChange = (updatedItems) => {
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    if (errors.items) {
      setErrors((prev) => {
        const next = { ...prev, items: undefined };
        Object.keys(next).forEach((key) => {
          if (key.startsWith('items[')) delete next[key];
        });
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateQuoteForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      clientId: Number(formData.clientId),
      title: formData.title,
      description: formData.description || null,
      currency: formData.currency,
      discountAmount: parseFloat(formData.discountAmount) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      notes: formData.notes || null,
      items: formData.items.map((item) => ({
        title: item.title,
        description: item.description || null,
        quantity: parseFloat(item.quantity) || 0,
        unitPrice: parseFloat(item.unitPrice) || 0,
      })),
    };

    if (formData.validUntil) {
      payload.validUntil = new Date(formData.validUntil + 'T23:59:59.000Z').toISOString();
    }

    onSubmit(payload);
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.businessName,
  }));

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Información General</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <Select
              label="Cliente"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              options={clientOptions}
              placeholder="Seleccione un cliente"
              error={errors.clientId}
              required
            />
          </div>

          <div className={styles.field}>
            <Input
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Título de la cotización"
              required
            />
          </div>

          <div className={styles.fullWidth}>
            <TextArea
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción general de la cotización"
              rows={3}
            />
          </div>

          <div className={styles.threeCol}>
            <Select
              label="Moneda"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={CURRENCY_OPTIONS}
            />
            <Input
              label="Válida hasta"
              name="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={handleChange}
            />
            <div />
          </div>

          <div className={styles.field}>
            <Input
              label="Descuento"
              name="discountAmount"
              type="number"
              value={formData.discountAmount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className={styles.field}>
            <Input
              label="Impuesto (%)"
              name="taxRate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={formData.taxRate}
              onChange={handleChange}
              placeholder="0"
              error={errors.taxRate}
            />
          </div>

          <div className={styles.fullWidth}>
            <TextArea
              label="Notas"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas o condiciones adicionales"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <QuoteItemsEditor
          items={formData.items}
          onChange={handleItemsChange}
          errors={errors}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Actualizar Cotización' : 'Crear Cotización'}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
