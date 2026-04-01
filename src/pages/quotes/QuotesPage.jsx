import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import QuoteFilters from '../../modules/quotes/components/QuoteFilters';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import { getQuotes } from '../../modules/quotes/services/quotes.service';
import { getClients } from '../../modules/clients/services/clients.service';
import { usePagination } from '../../core/hooks/usePagination';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import styles from './QuotesPage.module.css';

export default function QuotesPage() {
  const navigate = useNavigate();
  const { page, limit, goToPage } = usePagination();

  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', clientId: '' });

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.clientId) params.clientId = filters.clientId;

      const response = await getQuotes(params);
      const result = response.data;
      setQuotes(result.data?.data || []);
      setPagination(result.data?.pagination || { totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await getClients({ limit: 100 });
        setClients(response.data?.data?.data || []);
      } catch {
        /* non-critical */
      }
    };
    loadClients();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    goToPage(1);
  };

  const columns = [
    {
      key: 'quoteNumber',
      label: '# Cotización',
      render: (val) => <span className={styles.quoteNumber}>{val}</span>,
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (_, row) => (
        <span className={styles.clientName}>{row.client?.businessName || '—'}</span>
      ),
    },
    {
      key: 'title',
      label: 'Título',
    },
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
          <Link to={`/quotes/${row.id}`} className={styles.actionBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2.5C3.5 2.5 1 7 1 7s2.5 4.5 6 4.5S13 7 13 7s-2.5-4.5-6-4.5Z" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Ver
          </Link>
          {row.status === 'draft' && (
            <Link to={`/quotes/${row.id}/edit`} className={styles.actionBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 2l2 2-7 7H3V9l7-7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              Editar
            </Link>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Cotizaciones" />
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchQuotes}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Cotizaciones" subtitle="Gestión de cotizaciones">
        <Button variant="primary" onClick={() => navigate('/quotes/new')}>
          Nueva Cotización
        </Button>
      </PageHeader>

      <QuoteFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        clients={clients}
      />

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
