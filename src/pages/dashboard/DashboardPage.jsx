import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Table from '../../components/ui/Table';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import { getClients } from '../../modules/clients/services/clients.service';
import { getProjects } from '../../modules/projects/services/projects.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import api from '../../core/api/axios';
import { ENDPOINTS } from '../../core/api/endpoints';
import { buildQueryParams } from '../../core/utils/queryParams';
import styles from './DashboardPage.module.css';

const QUOTE_COLUMNS = [
  { key: 'quoteNumber', label: 'N° Cotización' },
  { key: 'client', label: 'Cliente' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Estado' },
  { key: 'date', label: 'Fecha' },
];

const PROJECT_COLUMNS = [
  { key: 'projectNumber', label: 'N° Proyecto' },
  { key: 'title', label: 'Título' },
  { key: 'total', label: 'Total' },
  {
    key: 'status',
    label: 'Estado',
    render: (val) => <ProjectStatusBadge status={val} />,
  },
  { key: 'date', label: 'Fecha' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalPending: 0,
    totalCollected: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          clientsRes,
          draftQuotesRes,
          acceptedQuotesRes,
          activeProjectsRes,
          completedProjectsRes,
          allProjectsRes,
          recentQuotesRes,
          recentProjectsRes,
        ] = await Promise.all([
          getClients({ limit: 1 }),
          api.get(`${ENDPOINTS.QUOTES.BASE}${buildQueryParams({ status: 'draft', limit: 1 })}`),
          api.get(`${ENDPOINTS.QUOTES.BASE}${buildQueryParams({ status: 'fully_accepted', limit: 1 })}`),
          getProjects({ status: 'in_progress', limit: 1 }),
          getProjects({ status: 'completed', limit: 1 }),
          getProjects({ limit: 100 }),
          api.get(`${ENDPOINTS.QUOTES.BASE}${buildQueryParams({ limit: 5 })}`),
          getProjects({ limit: 5 }),
        ]);

        const allProjects = allProjectsRes.data?.data?.data || [];
        let totalPending = 0;
        let totalCollected = 0;
        for (const p of allProjects) {
          totalPending += parseFloat(p.pendingAmount) || 0;
          totalCollected += parseFloat(p.paidAmount) || 0;
        }

        setStats({
          totalClients: clientsRes.data?.data?.pagination?.total || 0,
          pendingQuotes: draftQuotesRes.data?.data?.pagination?.total || 0,
          acceptedQuotes: acceptedQuotesRes.data?.data?.pagination?.total || 0,
          activeProjects: activeProjectsRes.data?.data?.pagination?.total || 0,
          completedProjects: completedProjectsRes.data?.data?.pagination?.total || 0,
          totalPending,
          totalCollected,
        });

        const quotes = recentQuotesRes.data?.data?.data || [];
        setRecentQuotes(
          quotes.map((q) => ({
            id: q._id || q.id,
            quoteNumber: q.quoteNumber,
            client: q.client?.businessName || q.client?.contactName || '—',
            total: formatCurrency(q.totalAmount),
            status: q.status,
            date: formatDate(q.createdAt),
          }))
        );

        const projects = recentProjectsRes.data?.data?.data || [];
        setRecentProjects(
          projects.map((p) => ({
            id: p._id || p.id,
            projectNumber: p.projectNumber,
            title: p.title,
            total: formatCurrency(p.totalAmount),
            status: p.status,
            date: formatDate(p.createdAt),
          }))
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <PageHeader title="Dashboard" subtitle="Resumen general" />
        <Loader fullPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Dashboard" subtitle="Resumen general" />
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Dashboard" subtitle="Resumen general" />

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Clientes"
          value={stats.totalClients}
          variant="info"
        />
        <StatCard
          title="Cotizaciones Pendientes"
          value={stats.pendingQuotes}
          variant="warning"
        />
        <StatCard
          title="Cotizaciones Aceptadas"
          value={stats.acceptedQuotes}
          variant="success"
        />
        <StatCard
          title="Proyectos en Curso"
          value={stats.activeProjects}
          variant="primary"
        />
        <StatCard
          title="Proyectos Finalizados"
          value={stats.completedProjects}
          variant="success"
        />
        <StatCard
          title="Total Pendiente por Cobrar"
          value={formatCurrency(stats.totalPending)}
          variant="danger"
        />
        <StatCard
          title="Total Cobrado"
          value={formatCurrency(stats.totalCollected)}
          variant="success"
        />
      </div>

      <div className={styles.tables}>
        <Card
          title="Cotizaciones Recientes"
          actions={
            <Link to="/quotes" className={styles.viewAll}>
              Ver todas
            </Link>
          }
        >
          <Table
            columns={QUOTE_COLUMNS}
            data={recentQuotes}
            emptyMessage="No hay cotizaciones recientes."
          />
        </Card>

        <Card
          title="Proyectos Recientes"
          actions={
            <Link to="/projects" className={styles.viewAll}>
              Ver todos
            </Link>
          }
        >
          <Table
            columns={PROJECT_COLUMNS}
            data={recentProjects}
            emptyMessage="No hay proyectos recientes."
          />
        </Card>
      </div>
    </div>
  );
}
