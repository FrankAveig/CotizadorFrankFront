import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useClientAuth } from '../../context/ClientAuthContext';
import { useApp } from '../../context/AppContext';
import { validateChangePassword } from '../../modules/portal/validations/portal-password.validation';
import styles from './PortalSettingsPage.module.css';

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

export default function PortalSettingsPage() {
  const { changePassword } = useClientAuth();
  const { addNotification } = useApp();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const baseErrors = validateChangePassword(formData);

    if (
      formData.newPassword &&
      formData.confirmNewPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      baseErrors.confirmNewPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.confirmNewPassword || !formData.confirmNewPassword.trim()) {
      baseErrors.confirmNewPassword = 'Debe confirmar la nueva contraseña';
    }

    return baseErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await changePassword(formData.currentPassword, formData.newPassword);
      addNotification('success', 'Contraseña actualizada exitosamente');
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Configuración" subtitle="Cambiar contraseña" />

      <div className={styles.formWrapper}>
        <Card>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Input
              label="Contraseña Actual"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
              placeholder="Ingrese su contraseña actual"
              autoComplete="current-password"
            />

            <Input
              label="Nueva Contraseña"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Nueva Contraseña"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              error={errors.confirmNewPassword}
              required
              placeholder="Repita la nueva contraseña"
              autoComplete="new-password"
            />

            <div className={styles.actions}>
              <Button type="submit" variant="primary" loading={loading}>
                Cambiar Contraseña
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
