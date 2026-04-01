import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import TextArea from '../../../components/ui/TextArea';
import { validateClientForm } from '../validations/client.validation';
import styles from './ClientForm.module.css';

const INITIAL_VALUES = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
  password: '',
  isActive: true,
};

const ClientForm = ({ initialData, onSubmit, loading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessName: initialData.businessName || '',
        contactName: initialData.contactName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        taxId: initialData.taxId || '',
        password: '',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateClientForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }
    onSubmit(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.field}>
          <Input
            label="Razón Social"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Nombre de Contacto"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            error={errors.contactName}
            placeholder="Persona de contacto"
            required
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+593 999 999 999"
            required
          />
        </div>

        <div className={styles.field}>
          <Input
            label="RUC / Identificación Fiscal"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="0000000000001"
          />
        </div>

        <div className={styles.field}>
          <Input
            label={initialData ? 'Nueva Contraseña (Portal)' : 'Contraseña (Portal)'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={initialData ? 'Dejar vacío para no cambiar' : 'Contraseña de acceso al portal'}
            autoComplete="new-password"
          />
          <span className={styles.fieldHint}>
            {initialData
              ? 'Solo completa si deseas cambiar la contraseña del portal'
              : 'Opcional. Permite al cliente acceder al portal de clientes'}
          </span>
        </div>

        <div className={styles.field}>
          <TextArea
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dirección completa"
            rows={3}
          />
        </div>

        <div className={styles.fieldToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
            <span className={styles.toggleText}>Cliente Activo</span>
          </label>
        </div>
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
          {initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
