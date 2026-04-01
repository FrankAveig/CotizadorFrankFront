import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import ProjectPaymentsSummary from '../../modules/projects/components/ProjectPaymentsSummary';
import ProjectItemsTable from '../../modules/projects/components/ProjectItemsTable';
import PaymentHistoryTable from '../../modules/payments/components/PaymentHistoryTable';
import DocumentList from '../../modules/documents/components/DocumentList';
import ProjectInvoicesSection from '../../modules/projects/components/ProjectInvoicesSection';
import {
  getProjectById,
  updateProjectStatus,
  updateProjectItemStatus,
  getProjectPayments,
  getProjectDocuments,
} from '../../modules/projects/services/projects.service';
import { getValidTransitions } from '../../modules/projects/validations/project.validation';
import { PROJECT_STATUSES } from '../../core/constants/statuses';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { useApp } from '../../context/AppContext';
import styles from './ProjectDetailPage.module.css';

const statusLabelMap = Object.values(PROJECT_STATUSES).reduce((acc, s) => {
  acc[s.value] = s.label;
  return acc;
}, {});

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [project, setProject] = useState(null);
  const [payments, setPayments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusAction, setStatusAction] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [itemStatusUpdatingId, setItemStatusUpdatingId] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await getProjectById(id);
      setProject(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el proyecto.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const { data: res } = await getProjectPayments(id);
      setPayments(res.data?.data || res.data || []);
    } catch {
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, [id]);

  const fetchDocuments = useCallback(async () => {
    try {
      setDocumentsLoading(true);
      const { data: res } = await getProjectDocuments(id);
      setDocuments(res.data?.data || res.data || []);
    } catch {
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
    fetchPayments();
    fetchDocuments();
  }, [fetchProject, fetchPayments, fetchDocuments]);

  const handleStatusChange = async () => {
    if (!statusAction) return;
    try {
      setStatusLoading(true);
      await updateProjectStatus(id, { status: statusAction });
      addNotification('success', 'Estado del proyecto actualizado.');
      setStatusAction(null);
      fetchProject();
      fetchPayments();
    } catch (err) {
      addNotification(
        'error',
        err.response?.data?.message || 'Error al actualizar el estado.'
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleItemStatusChange = async (itemId, status) => {
    try {
      setItemStatusUpdatingId(itemId);
      await updateProjectItemStatus(id, itemId, { status });
      addNotification('success', 'Estado del ítem actualizado.');
      await fetchProject();
    } catch (err) {
      addNotification(
        'error',
        err.response?.data?.message ||
          'No se pudo actualizar el estado del ítem.'
      );
    } finally {
      setItemStatusUpdatingId(null);
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
        <PageHeader title="Proyecto" />
        <div className={styles.error}>
          <p>{error || 'Proyecto no encontrado.'}</p>
          <Button onClick={() => navigate('/projects')}>Volver a proyectos</Button>
        </div>
      </div>
    );
  }

  const validTransitions = getValidTransitions(project.status);
  const clientName =
    project.client?.businessName || project.client?.contactName || '—';

  const isInvoiceDoc = (d) =>
    (d.documentType || d.type) === 'invoice_pdf';
  const invoiceDocuments = documents.filter(isInvoiceDoc);
  const otherDocuments = documents.filter((d) => !isInvoiceDoc(d));

  return (
    <div className={styles.page}>
      <PageHeader title={`Proyecto ${project.projectNumber}`}>
        <Button variant="secondary" onClick={() => navigate('/projects')}>
          Volver
        </Button>
        {validTransitions.length > 0 && (
          <Button
            variant="primary"
            onClick={() => navigate(`/projects/${id}/payments`)}
          >
            Registrar Pago
          </Button>
        )}
      </PageHeader>

      <div className={styles.grid}>
        <Card title="Información General">
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>N° Proyecto</span>
              <span className={styles.infoValue}>{project.projectNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Título</span>
              <span className={styles.infoValue}>{project.title}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estado</span>
              <span className={styles.infoValue}>
                <ProjectStatusBadge status={project.status} />
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de creación</span>
              <span className={styles.infoValue}>
                {formatDate(project.createdAt)}
              </span>
            </div>
            {project.description && (
              <div className={`${styles.infoItem} ${styles.full}`}>
                <span className={styles.infoLabel}>Descripción</span>
                <span className={styles.infoValue}>{project.description}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Cliente">
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre</span>
              <span className={styles.infoValue}>{clientName}</span>
            </div>
            {project.client?.email && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Correo</span>
                <span className={styles.infoValue}>{project.client.email}</span>
              </div>
            )}
            {project.client?.phone && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Teléfono</span>
                <span className={styles.infoValue}>{project.client.phone}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {project.quote && (
        <Card title="Cotización de Origen">
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>N° Cotización</span>
              <span className={styles.infoValue}>
                <Link
                  to={`/quotes/${project.quote._id || project.quote.id}`}
                  className={styles.link}
                >
                  {project.quote.quoteNumber || project.quoteNumber}
                </Link>
              </span>
            </div>
            {project.acceptance && (
              <>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tipo de aceptación</span>
                  <span className={styles.infoValue}>
                    {project.acceptance.type === 'full'
                      ? 'Aceptación total'
                      : 'Aceptación parcial'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fecha de aceptación</span>
                  <span className={styles.infoValue}>
                    {formatDate(project.acceptance.acceptedAt || project.acceptedAt)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Total aceptado</span>
                  <span className={styles.infoValue}>
                    {formatCurrency(project.acceptance.acceptedTotal || project.totalAmount)}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      <ProjectPaymentsSummary
        totalAmount={project.totalAmount}
        paidAmount={project.paidAmount}
        pendingAmount={project.pendingAmount}
        paidPercentage={project.paidPercentage}
        isFullyPaid={project.isFullyPaid}
      />

      {validTransitions.length > 0 && (
        <Card title="Cambiar Estado">
          <div className={styles.statusActions}>
            {validTransitions.map((newStatus) => (
              <Button
                key={newStatus}
                variant={newStatus === 'canceled' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => setStatusAction(newStatus)}
              >
                {statusLabelMap[newStatus] || newStatus}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <Card title="Ítems del Proyecto">
        <ProjectItemsTable
          items={project.items || []}
          projectId={id}
          onItemStatusChange={handleItemStatusChange}
          itemStatusUpdatingId={itemStatusUpdatingId}
        />
      </Card>

      <Card title="Historial de Pagos">
        <PaymentHistoryTable payments={payments} loading={paymentsLoading} />
      </Card>

      <ProjectInvoicesSection
        projectId={id}
        invoices={invoiceDocuments}
        loading={documentsLoading}
        onRefresh={fetchDocuments}
        addNotification={addNotification}
      />

      <Card title="Otros documentos">
        <DocumentList
          documents={otherDocuments}
          loading={documentsLoading}
          emptyTitle="Sin otros documentos"
          emptyMessage="No hay más archivos en este proyecto aparte de las facturas."
        />
      </Card>

      <ConfirmDialog
        isOpen={!!statusAction}
        onClose={() => setStatusAction(null)}
        onConfirm={handleStatusChange}
        title="Cambiar estado del proyecto"
        message={`¿Deseas cambiar el estado del proyecto a "${statusLabelMap[statusAction] || statusAction}"?`}
        confirmText="Cambiar estado"
        variant={statusAction === 'canceled' ? 'danger' : 'primary'}
        loading={statusLoading}
      />
    </div>
  );
}
