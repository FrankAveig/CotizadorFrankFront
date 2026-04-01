import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import PortalProjectProgress from '../../modules/portal/components/PortalProjectProgress';
import PortalDocumentDownloadButton from '../../modules/portal/components/PortalDocumentDownloadButton';
import { getPortalProjectById } from '../../modules/portal/services/portal-projects.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { PAYMENT_METHODS } from '../../core/constants/statuses';
import styles from './PortalProjectDetailPage.module.css';

const paymentMethodLabel = (method) => {
  const found = Object.values(PAYMENT_METHODS).find((m) => m.value === method);
  return found ? found.label : method || '—';
};

const ITEM_COLUMNS = [
  { key: 'title', label: 'Descripción' },
  { key: 'description', label: 'Detalle' },
  {
    key: 'quantity',
    label: 'Cantidad',
    render: (val) => parseFloat(val) || 0,
  },
  {
    key: 'unitPrice',
    label: 'Precio Unitario',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'subtotal',
    label: 'Subtotal',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'status',
    label: 'Estado',
    render: (val) => {
      const map = {
        accepted: { label: 'Aceptado', variant: 'success' },
        rejected: { label: 'Rechazado', variant: 'danger' },
        pending: { label: 'Pendiente', variant: 'warning' },
        in_progress: { label: 'En progreso', variant: 'primary' },
        completed: { label: 'Completado', variant: 'success' },
        canceled: { label: 'Cancelado', variant: 'default' },
      };
      const info = map[val] || { label: val || '—', variant: 'default' };
      return <Badge variant={info.variant}>{info.label}</Badge>;
    },
  },
];

const PAYMENT_COLUMNS = [
  {
    key: 'paymentDate',
    label: 'Fecha',
    render: (val) => formatDate(val),
  },
  {
    key: 'amount',
    label: 'Monto',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'percentageEquivalent',
    label: '%',
    render: (val) => `${(parseFloat(val) || 0).toFixed(1)}%`,
  },
  {
    key: 'paymentMethod',
    label: 'Método',
    render: (val) => paymentMethodLabel(val),
  },
  { key: 'reference', label: 'Referencia' },
  { key: 'notes', label: 'Notas' },
];

export default function PortalProjectDetailPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPortalProjectById(id);
      setProject(response.data?.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchProject}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const items = project.items || [];
  const payments = project.payments || [];
  const documents = project.documents || [];
  const acceptance = project.acceptance || {};

  const isInvoiceDoc = (d) =>
    (d.documentType || d.type) === 'invoice_pdf';
  const invoiceDocuments = documents.filter(isInvoiceDoc);
  const otherDocuments = documents.filter((d) => !isInvoiceDoc(d));

  return (
    <div className={styles.page}>
      <Link to="/portal/projects" className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a proyectos
      </Link>

      <PageHeader
        title={project.title || 'Proyecto'}
        subtitle={`#${project.projectNumber || ''}`}
      >
        <ProjectStatusBadge status={project.status} />
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
              <span className={styles.infoLabel}>Fecha de creación</span>
              <span className={styles.infoValue}>{formatDate(project.createdAt)}</span>
            </div>
            {project.startedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de inicio</span>
                <span className={styles.infoValue}>{formatDate(project.startedAt)}</span>
              </div>
            )}
            {project.description && (
              <div className={`${styles.infoItem} ${styles.full}`}>
                <span className={styles.infoLabel}>Descripción</span>
                <span className={styles.infoValue}>{project.description}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Cotización de Origen">
          <div className={styles.infoGrid}>
            {project.quote && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>N° Cotización</span>
                <span className={styles.infoValue}>
                  <Link
                    to={`/portal/quotes/${project.quote._id || project.quote.id || project.quoteId}`}
                    className={styles.link}
                  >
                    {project.quote.quoteNumber || project.quoteNumber || '—'}
                  </Link>
                </span>
              </div>
            )}
            {acceptance.acceptanceType && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tipo de aceptación</span>
                <span className={styles.infoValue}>
                  {acceptance.acceptanceType === 'full' ? 'Aceptación total' : 'Aceptación parcial'}
                </span>
              </div>
            )}
            {(acceptance.acceptedAt || project.acceptedAt) && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de aceptación</span>
                <span className={styles.infoValue}>
                  {formatDate(acceptance.acceptedAt || project.acceptedAt)}
                </span>
              </div>
            )}
            {(acceptance.acceptedTotal || acceptance.acceptedTotalAmount) && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Total aceptado</span>
                <span className={styles.infoValue}>
                  {formatCurrency(acceptance.acceptedTotal || acceptance.acceptedTotalAmount)}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <PortalProjectProgress
        totalAmount={project.totalAmount}
        paidAmount={project.paidAmount}
        pendingAmount={project.pendingAmount}
        paidPercentage={project.paidPercentage}
      />

      <Card title="Ítems del Proyecto">
        <Table
          columns={ITEM_COLUMNS}
          data={items}
          emptyMessage="No hay ítems en este proyecto."
        />
      </Card>

      <Card title="Historial de Pagos">
        <Table
          columns={PAYMENT_COLUMNS}
          data={payments}
          emptyMessage="No hay pagos registrados."
        />
      </Card>

      <Card title="Facturas">
        {invoiceDocuments.length === 0 ? (
          <p className={styles.emptyDocs}>
            No hay facturas emitidas para este proyecto todavía.
          </p>
        ) : (
          <div className={styles.invoiceList}>
            {invoiceDocuments.map((doc) => (
              <div
                key={doc._id || doc.id}
                className={styles.invoiceItem}
              >
                <div className={styles.invoiceMain}>
                  <span className={styles.invoiceNumber}>
                    {doc.invoiceNumber || doc.fileName || 'Factura'}
                  </span>
                  {doc.notes && (
                    <span className={styles.invoiceNotes}>{doc.notes}</span>
                  )}
                  <span className={styles.invoiceMeta}>
                    {formatDate(doc.createdAt)}
                    {doc.fileName && doc.invoiceNumber ? (
                      <span className={styles.invoiceFile}>
                        {' · '}
                        {doc.fileName}
                      </span>
                    ) : null}
                  </span>
                </div>
                <PortalDocumentDownloadButton document={doc}>
                  Descargar
                </PortalDocumentDownloadButton>
              </div>
            ))}
          </div>
        )}
      </Card>

      {otherDocuments.length > 0 && (
        <Card title="Otros documentos">
          <div className={styles.docList}>
            {otherDocuments.map((doc) => (
              <div key={doc._id || doc.id} className={styles.docItem}>
                <div className={styles.docInfo}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.docIcon}>
                    <path d="M4 1h5l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span>{doc.fileName || doc.originalName || 'Documento'}</span>
                </div>
                <PortalDocumentDownloadButton document={doc} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
