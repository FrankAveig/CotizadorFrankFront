import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { useApp } from '../../context/AppContext';
import { getProfile, updateProfile } from '../../modules/portal/services/portal-profile.service';
import { validateProfileForm } from '../../modules/portal/validations/portal-profile.validation';
import styles from './PortalProfilePage.module.css';

export default function PortalProfilePage() {
  const { addNotification } = useApp();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        const data = response.data?.data || response.data;
        setProfile(data);
        setFormData({
          contactName: data.contactName || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormErrors({});
    setFormData({
      contactName: profile?.contactName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
  };

  const handleSave = async () => {
    const errors = validateProfileForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      const response = await updateProfile(formData);
      const updated = response.data?.data || response.data;
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditing(false);
      addNotification('success', 'Perfil actualizado exitosamente');
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Mi Perfil" subtitle="Información de su cuenta" />
        <Loader fullPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Mi Perfil" subtitle="Información de su cuenta" />
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Mi Perfil" subtitle="Información de su cuenta">
        {!editing ? (
          <Button variant="primary" size="sm" onClick={() => setEditing(true)}>
            Editar
          </Button>
        ) : (
          <div className={styles.headerActions}>
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              Guardar
            </Button>
          </div>
        )}
      </PageHeader>

      <Card>
        <div className={styles.profileGrid}>
          <div className={styles.fieldGroup}>
            <Input
              label="Razón Social"
              name="businessName"
              value={profile?.businessName || ''}
              disabled
              onChange={() => {}}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              label="Nombre de Contacto"
              name="contactName"
              value={editing ? formData.contactName : (profile?.contactName || '')}
              onChange={handleChange}
              disabled={!editing}
              error={formErrors.contactName}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={profile?.email || ''}
              disabled
              onChange={() => {}}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              label="Teléfono"
              name="phone"
              value={editing ? formData.phone : (profile?.phone || '')}
              onChange={handleChange}
              disabled={!editing}
              error={formErrors.phone}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              label="RUC / Identificación Fiscal"
              name="taxId"
              value={profile?.taxId || ''}
              disabled
              onChange={() => {}}
            />
          </div>

          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <TextArea
              label="Dirección"
              name="address"
              value={editing ? formData.address : (profile?.address || '')}
              onChange={handleChange}
              disabled={!editing}
              error={formErrors.address}
            />
          </div>
        </div>
      </Card>

      <div className={styles.settingsLink}>
        <Link to="/portal/settings" className={styles.link}>
          Cambiar contraseña
        </Link>
      </div>
    </div>
  );
}
