import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import PaymentForm from '../../modules/payments/components/PaymentForm';
import { getProjectById } from '../../modules/projects/services/projects.service';
import { createPayment } from '../../modules/payments/services/payments.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { useApp } from '../../context/AppContext';
import styles from './PaymentCreatePage.module.css';

export default function PaymentCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data: res } = await getProjectById(id);
        setProject(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el proyecto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await createPayment({
        ...formData,
        projectId: Number(id),
      });
      addNotification('success', 'Pago registrado exitosamente.');
      navigate(`/projects/${id}`);
    } catch (err) {
      addNotification(
        'error',
        err.response?.data?.message || 'Error al registrar el pago.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader fullPage />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <PageHeader title="Registrar Pago" />
        <div className={styles.error}>
          <p>{error || 'Proyecto no encontrado.'}</p>
          <Button onClick={() => navigate('/projects')}>Volver a proyectos</Button>
        </div>
      </div>
    );
  }

  const pendingAmount = parseFloat(project.pendingAmount) || 0;

  return (
    <div className={styles.page}>
      <PageHeader title="Registrar Pago">
        <Button variant="secondary" onClick={() => navigate(`/projects/${id}`)}>
          Volver al proyecto
        </Button>
      </PageHeader>

      <Card title="Información del Proyecto">
        <div className={styles.projectInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Proyecto</span>
            <span className={styles.infoValue}>
              {project.projectNumber} — {project.title}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total</span>
            <span className={styles.infoValue}>
              {formatCurrency(project.totalAmount)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Pagado</span>
            <span className={`${styles.infoValue} ${styles.paid}`}>
              {formatCurrency(project.paidAmount)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Pendiente</span>
            <span className={`${styles.infoValue} ${styles.pending}`}>
              {formatCurrency(pendingAmount)}
            </span>
          </div>
        </div>
      </Card>

      <Card title="Datos del Pago">
        <PaymentForm
          onSubmit={handleSubmit}
          loading={submitting}
          projectId={id}
          maxAmount={pendingAmount}
        />
      </Card>
    </div>
  );
}
