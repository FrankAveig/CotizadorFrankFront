import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import { getPortalProjects } from '../../modules/portal/services/portal-projects.service';
import { usePagination } from '../../core/hooks/usePagination';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { PROJECT_STATUSES } from '../../core/constants/statuses';
import styles from './PortalProjectsPage.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...Object.values(PROJECT_STATUSES).map((s) => ({
    value: s.value,
    label: s.label,
  })),
];

export default function PortalProjectsPage() {
  const { page, limit, goToPage } = usePagination();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;

      const response = await getPortalProjects(params);
      const result = response.data;
      setProjects(result.data?.data || []);
      setPagination(result.data?.pagination || { totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    goToPage(1);
  }, [statusFilter]);

  const columns = [
    {
      key: 'projectNumber',
      label: 'N° Proyecto',
      render: (val) => <span className={styles.projectNumber}>{val}</span>,
    },
    { key: 'title', label: 'Título' },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (val) => <span className={styles.amount}>{formatCurrency(val)}</span>,
    },
    {
      key: 'paidAmount',
      label: 'Pagado',
      render: (val) => (
        <span className={styles.paidAmount}>{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'pendingAmount',
      label: 'Pendiente',
      render: (val) => (
        <span className={styles.pendingAmount}>{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'paidPercentage',
      label: 'Progreso',
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
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <Link to={`/portal/projects/${row._id || row.id}`} className={styles.actionBtn}>
          Ver
        </Link>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Mis Proyectos" />
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchProjects}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Mis Proyectos" />

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
          data={projects}
          loading={loading}
          emptyMessage="No se encontraron proyectos."
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
