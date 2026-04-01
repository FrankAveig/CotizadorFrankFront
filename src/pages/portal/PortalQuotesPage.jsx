import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import { getPortalQuotes } from '../../modules/portal/services/portal-quotes.service';
import { usePagination } from '../../core/hooks/usePagination';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import styles from './PortalQuotesPage.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'sent', label: 'Enviada' },
  { value: 'issued', label: 'Emitida' },
  { value: 'viewed', label: 'Vista' },
  { value: 'fully_accepted', label: 'Aceptada' },
  { value: 'partially_accepted', label: 'Parcialmente aceptada' },
];

const CAN_ACCEPT_STATUSES = ['issued', 'sent', 'viewed'];

export default function PortalQuotesPage() {
  const { page, limit, goToPage } = usePagination();

  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;

      const response = await getPortalQuotes(params);
      const result = response.data;
      setQuotes(result.data?.data || []);
      setPagination(result.data?.pagination || { totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    goToPage(1);
  }, [statusFilter]);

  const columns = [
    {
      key: 'quoteNumber',
      label: 'N° Cotización',
      render: (val) => <span className={styles.quoteNumber}>{val}</span>,
    },
    { key: 'title', label: 'Título' },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (val) => <span className={styles.total}>{formatCurrency(val)}</span>,
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
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className={styles.actionsCell}>
          <Link to={`/portal/quotes/${row._id || row.id}`} className={styles.actionBtn}>
            Ver
          </Link>
          {CAN_ACCEPT_STATUSES.includes(row.status) && (
            <Link
              to={`/portal/quotes/${row._id || row.id}`}
              className={`${styles.actionBtn} ${styles.acceptBtn}`}
            >
              Aceptar
            </Link>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Mis Cotizaciones" />
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchQuotes}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Mis Cotizaciones" />

      <div className={styles.filters}>
        <Select
          name="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
          placeholder="Filtrar por estado"
        />
      </div>

      <div className={styles.tableWrap}>
        <Table
          columns={columns}
          data={quotes}
          loading={loading}
          emptyMessage="No se encontraron cotizaciones."
        />
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className={styles.paginationWrap}>
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
