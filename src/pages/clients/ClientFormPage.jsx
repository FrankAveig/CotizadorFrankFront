import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import ClientForm from '../../modules/clients/components/ClientForm';
import {
  getClientById,
  createClient,
  updateClient,
} from '../../modules/clients/services/clients.service';
import { useApp } from '../../context/AppContext';
import styles from './ClientFormPage.module.css';

export default function ClientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const isEditing = !!id;

  const [initialData, setInitialData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;

    const fetchClient = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const response = await getClientById(id);
        setInitialData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos del cliente');
        addNotification('error', 'Error al cargar los datos del cliente');
      } finally {
        setLoadingData(false);
      }
    };

    fetchClient();
  }, [id, isEditing, addNotification]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateClient(id, formData);
        addNotification('success', 'Cliente actualizado correctamente');
        navigate(`/clients/${id}`);
      } else {
        const response = await createClient(formData);
        const newId = response.data.data.id;
        addNotification('success', 'Cliente creado correctamente');
        navigate(`/clients/${newId}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al guardar el cliente';
      addNotification('error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.page}>
        <Loader fullPage size="lg" />
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <p>{error}</p>
          <Button variant="secondary" onClick={() => navigate('/clients')}>
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/clients" className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a clientes
      </Link>

      <PageHeader
        title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        subtitle={isEditing ? initialData?.businessName : 'Registrar un nuevo cliente'}
      />

      <Card>
        <ClientForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </Card>
    </div>
  );
}
