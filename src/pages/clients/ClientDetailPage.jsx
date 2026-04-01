import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import { getClientById, deleteClient } from '../../modules/clients/services/clients.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { useApp } from '../../context/AppContext';
import styles from './ClientDetailPage.module.css';

const QUOTE_COLUMNS = [
  {
    key: 'quoteNumber',
    label: '# Cotización',
    render: (val, row) => (
      <Link to={`/quotes/${row.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
        {val}
      </Link>
    ),
  },
  { key: 'title', label: 'Título' },
  {
    key: 'totalAmount',
    label: 'Total',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'status',
    label: 'Estado',
    render: (val) => <QuoteStatusBadge status={val} />,
  },
  {
    key: 'createdAt',
    label: 'Fecha',
    render: (val) => formatDate(val),
  },
];

const PROJECT_COLUMNS = [
  {
    key: 'projectNumber',
    label: '# Proyecto',
    render: (val, row) => (
      <Link to={`/projects/${row.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
        {val}
      </Link>
    ),
  },
  { key: 'title', label: 'Título' },
  {
    key: 'totalAmount',
    label: 'Total',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'status',
    label: 'Estado',
    render: (val) => <ProjectStatusBadge status={val} />,
  },
  {
    key: 'createdAt',
    label: 'Fecha',
    render: (val) => formatDate(val),
  },
];

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getClientById(id);
        setClient(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteClient(id);
      addNotification('success', 'Cliente desactivado correctamente');
      navigate('/clients');
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al desactivar el cliente');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <Loader fullPage size="lg" />;

  if (error || !client) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <p>{error || 'Cliente no encontrado'}</p>
          <Button variant="secondary" onClick={() => navigate('/clients')}>
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  const quotes = client.quotes || [];
  const projects = client.projects || [];

  return (
    <div className={styles.page}>
      <Link to="/clients" className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a clientes
      </Link>

      <PageHeader title={client.businessName} subtitle={client.contactName}>
        <Button variant="primary" onClick={() => navigate(`/clients/${id}/edit`)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
          Desactivar
        </Button>
      </PageHeader>

      <Card title="Información del Cliente">
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Razón Social</span>
            <span className={styles.infoValue}>{client.businessName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Contacto</span>
            <span className={styles.infoValue}>{client.contactName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Correo Electrónico</span>
            <span className={styles.infoValue}>
              <a href={`mailto:${client.email}`} className={styles.emailLink}>{client.email}</a>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Teléfono</span>
            <span className={styles.infoValue}>{client.phone}</span>
          </div>
          {client.taxId && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>RUC / ID Fiscal</span>
              <span className={styles.infoValue}>{client.taxId}</span>
            </div>
          )}
          {client.address && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Dirección</span>
              <span className={styles.infoValue}>{client.address}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Estado</span>
            <span className={styles.infoValue}>
              <Badge variant={client.isActive ? 'success' : 'danger'}>
                {client.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Registro</span>
            <span className={styles.infoValue}>{formatDate(client.createdAt)}</span>
          </div>
        </div>
      </Card>

      <Card title={`Cotizaciones (${quotes.length})`}>
        {quotes.length > 0 ? (
          <Table columns={QUOTE_COLUMNS} data={quotes} emptyMessage="Sin cotizaciones" />
        ) : (
          <p className={styles.emptySection}>No hay cotizaciones asociadas a este cliente.</p>
        )}
      </Card>

      <Card title={`Proyectos (${projects.length})`}>
        {projects.length > 0 ? (
          <Table columns={PROJECT_COLUMNS} data={projects} emptyMessage="Sin proyectos" />
        ) : (
          <p className={styles.emptySection}>No hay proyectos asociados a este cliente.</p>
        )}
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Desactivar Cliente"
        message={`¿Está seguro que desea desactivar al cliente "${client.businessName}"?`}
        confirmText="Desactivar"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
