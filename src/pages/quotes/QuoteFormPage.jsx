import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import QuoteForm from '../../modules/quotes/components/QuoteForm';
import { getQuoteById, createQuote, updateQuote } from '../../modules/quotes/services/quotes.service';
import { getClients } from '../../modules/clients/services/clients.service';
import { useApp } from '../../context/AppContext';
import styles from './QuoteFormPage.module.css';

export default function QuoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const isEdit = Boolean(id);

  const [quote, setQuote] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientsRes = await getClients({ limit: 200 });
        setClients(clientsRes.data?.data?.data || []);

        if (isEdit) {
          const quoteRes = await getQuoteById(id);
          const data = quoteRes.data?.data;
          if (data && data.status !== 'draft') {
            setReadonly(true);
          }
          setQuote(data || null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateQuote(id, formData);
        addNotification('success', 'Cotización actualizada exitosamente');
        navigate(`/quotes/${id}`);
      } else {
        const response = await createQuote(formData);
        const newId = response.data?.data?.id;
        addNotification('success', 'Cotización creada exitosamente');
        navigate(newId ? `/quotes/${newId}` : '/quotes');
      }
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al guardar la cotización');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={() => navigate('/quotes')}>
            Volver a cotizaciones
          </Button>
        </div>
      </div>
    );
  }

  if (readonly) {
    return (
      <div className={styles.page}>
        <PageHeader title="Cotización" subtitle="No editable" />
        <div className={styles.readonlyNotice}>
          Esta cotización ya no se puede editar porque su estado es diferente a borrador.
        </div>
        <Button variant="secondary" onClick={() => navigate(`/quotes/${id}`)}>
          Ver detalle
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title={isEdit ? 'Editar Cotización' : 'Nueva Cotización'}
        subtitle={isEdit ? `Editando cotización #${quote?.quoteNumber || ''}` : 'Complete los datos de la cotización'}
      />
      <div className={styles.cardWrap}>
        <QuoteForm
          initialData={isEdit ? quote : null}
          onSubmit={handleSubmit}
          loading={submitting}
          clients={clients}
        />
      </div>
    </div>
  );
}
