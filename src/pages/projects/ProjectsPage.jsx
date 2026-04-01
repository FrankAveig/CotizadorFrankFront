import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import { getProjects } from '../../modules/projects/services/projects.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { PROJECT_STATUSES } from '../../core/constants/statuses';
import styles from './ProjectsPage.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...Object.values(PROJECT_STATUSES).map((s) => ({
    value: s.value,
    label: s.label,
  })),
];

const COLUMNS = [
  { key: 'projectNumber', label: 'N° Proyecto' },
  { key: 'client', label: 'Cliente' },
  { key: 'title', label: 'Título' },
  {
    key: 'totalAmount',
    label: 'Total',
    render: (val) => formatCurrency(val),
  },
  {
    key: 'paidAmount',
    label: 'Pagado',
    render: (val) => (
      <span style={{ color: 'var(--color-success, #22c55e)', fontWeight: 600 }}>
        {formatCurrency(val)}
      </span>
    ),
  },
  {
    key: 'pendingAmount',
    label: 'Pendiente',
    render: (val) => (
      <span style={{ color: 'var(--color-warning, #f59e0b)', fontWeight: 600 }}>
        {formatCurrency(val)}
      </span>
    ),
  },
  {
    key: 'paidPercentage',
    label: '% Pagado',
    render: (val) => {
      const pct = parseFloat(val) || 0;
      return (
        <div className={styles.miniProgress}>
          <div className={styles.miniTrack}>
            <div
              className={styles.miniBar}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className={styles.miniLabel}>{pct.toFixed(0)}%</span>
        </div>
      );
    },
  },
  {
    key: 'status',
    label: 'Estado',
    render: (val) => <ProjectStatusBadge status={val} />,
  },
  { key: 'actions', label: 'Acciones' },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const { data: res } = await getProjects(params);
      setProjects(res.data?.data || []);
      setPagination(res.data?.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar proyectos.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const rows = projects.map((p) => ({
    ...p,
    client: p.client?.businessName || p.client?.contactName || '—',
    actions: (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/projects/${p._id || p.id}`)}
      >
        Ver detalle
      </Button>
    ),
  }));

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Proyectos" />
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={fetchProjects}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Proyectos" />

      <div className={styles.filters}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o número..."
        />
        <Select
          name="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
          placeholder="Filtrar por estado"
        />
      </div>

      <Table columns={COLUMNS} data={rows} loading={loading} emptyMessage="No se encontraron proyectos." />

      {!loading && pagination.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
