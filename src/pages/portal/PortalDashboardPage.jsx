import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClientAuth } from '../../context/ClientAuthContext';
import { getDashboard } from '../../modules/portal/services/portal-dashboard.service';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { PAYMENT_METHODS } from '../../core/constants/statuses';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import ProjectStatusBadge from '../../modules/projects/components/ProjectStatusBadge';
import Loader from '../../components/ui/Loader';
import DonutChart from '../../modules/portal/components/charts/DonutChart';
import FinancialSummaryChart from '../../modules/portal/components/charts/FinancialSummaryChart';
import styles from './PortalDashboardPage.module.css';

function getPaymentMethodLabel(method) {
  const found = Object.values(PAYMENT_METHODS).find((m) => m.value === method);
  return found?.label || method;
}

/* ── Inline SVG Icons ─────────────────────── */

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

/* ── Banner Decorative SVG ────────────────── */

function BannerDecoration() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className={styles.bannerArt}>
      <rect x="140" y="30" width="50" height="50" rx="8" fill="rgba(255,255,255,0.15)" transform="rotate(15 165 55)" />
      <rect x="120" y="60" width="35" height="35" rx="6" fill="rgba(255,255,255,0.1)" transform="rotate(-10 137 77)" />
      <circle cx="60" cy="30" r="20" fill="rgba(255,255,255,0.08)" />
      <circle cx="170" cy="100" r="14" fill="rgba(255,255,255,0.12)" />
      <rect x="20" y="70" width="60" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="20" y="85" width="40" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="90" y="10" width="8" height="40" rx="4" fill="rgba(255,255,255,0.1)" />
      <rect x="105" y="20" width="8" height="30" rx="4" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}

/* ── Empty State ──────────────────────────── */

function EmptyState({ message }) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        <InboxIcon />
      </span>
      <p className={styles.emptyText}>{message}</p>
    </div>
  );
}

/* ── Main Component ───────────────────────── */

export default function PortalDashboardPage() {
  const { client } = useClientAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboard();
        if (!cancelled) setData(response.data?.data || response.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Error al cargar el dashboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const firstName = (client?.contactName || client?.businessName || 'Cliente').split(' ')[0];
  const businessName = client?.businessName || '';

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loaderWrap}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <WelcomeBanner firstName={firstName} businessName={businessName} />
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const activity = data?.activity || {};
  const quotes = stats.quotes || {};
  const projects = stats.projects || {};
  const documents = stats.documents || {};
  const financials = stats.financialSummary || {};

  const totalInvested = parseFloat(financials.totalInvested) || 0;
  const totalPaid = parseFloat(financials.totalPaid) || 0;
  const totalPending = parseFloat(financials.totalPending) || 0;

  const quotesTotal = quotes.total || 0;
  const quotesPending = quotes.pending || 0;
  const quotesAccepted = quotes.accepted || 0;
  const quotesOther = Math.max(quotesTotal - quotesPending - quotesAccepted, 0);

  const projectsTotal = projects.total || 0;
  const projectsActive = projects.active || 0;
  const projectsCompleted = projects.completed || 0;
  const projectsOther = Math.max(projectsTotal - projectsActive - projectsCompleted, 0);

  const acceptanceRate = quotesTotal > 0 ? Math.round((quotesAccepted / quotesTotal) * 100) : 0;

  return (
    <div className={styles.page}>
      {/* 1. Welcome Banner */}
      <WelcomeBanner firstName={firstName} businessName={businessName} />

      {/* 2. Chart Section */}
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <DonutChart
            title="Cotizaciones"
            segments={[
              { value: quotesPending, color: '#f59e0b', label: 'Pendientes' },
              { value: quotesAccepted, color: '#22c55e', label: 'Aceptadas' },
              { value: quotesOther, color: '#94a3b8', label: 'Otras' },
            ]}
            centerValue={quotesTotal}
            centerLabel="Total"
          />
        </div>

        <div className={styles.chartCard}>
          <DonutChart
            title="Proyectos"
            segments={[
              { value: projectsActive, color: '#3b82f6', label: 'Activos' },
              { value: projectsCompleted, color: '#22c55e', label: 'Completados' },
              { value: projectsOther, color: '#94a3b8', label: 'Otros' },
            ]}
            centerValue={projectsTotal}
            centerLabel="Total"
          />
        </div>

        <div className={styles.chartCard}>
          <FinancialSummaryChart
            totalInvested={totalInvested}
            totalPaid={totalPaid}
            totalPending={totalPending}
          />
        </div>
      </div>

      {/* 3. Quick Stats Row */}
      <div className={styles.statsRow}>
        <QuickStatCard
          icon={<ClockIcon />}
          color="#f59e0b"
          bgColor="#fffbeb"
          value={quotesPending}
          label="Cotizaciones Pendientes"
        />
        <QuickStatCard
          icon={<PlayIcon />}
          color="#3b82f6"
          bgColor="#eff6ff"
          value={projectsActive}
          label="Proyectos Activos"
        />
        <QuickStatCard
          icon={<FileIcon />}
          color="#8b5cf6"
          bgColor="#f5f3ff"
          value={documents.total || 0}
          label="Documentos"
        />
        <QuickStatCard
          icon={<TrendingUpIcon />}
          color="#22c55e"
          bgColor="#f0fdf4"
          value={`${acceptanceRate}%`}
          label="Tasa de Aceptación"
        />
      </div>

      {/* 4. Activity Section */}
      <div className={styles.activityGrid}>
        <RecentQuotes quotes={activity.recentQuotes || []} />
        <RecentProjects projects={activity.recentProjects || []} />
      </div>

      {/* 5. Recent Payments */}
      <RecentPayments payments={activity.recentPayments || []} />
    </div>
  );
}

/* ── Sub-Components ───────────────────────── */

function WelcomeBanner({ firstName, businessName }) {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <h1 className={styles.bannerGreeting}>Bienvenido de vuelta, {firstName}</h1>
        <p className={styles.bannerSubtitle}>Aquí está el resumen de su actividad</p>
        {businessName && (
          <span className={styles.bannerBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {businessName}
          </span>
        )}
      </div>
      <BannerDecoration />
    </div>
  );
}

function QuickStatCard({ icon, color, bgColor, value, label }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: bgColor, color }}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}

function RecentQuotes({ quotes }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Cotizaciones Recientes</h3>
        <Link to="/portal/quotes" className={styles.viewAll}>Ver todas</Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState message="No hay cotizaciones recientes" />
      ) : (
        <div className={styles.activityList}>
          {quotes.map((q) => (
            <Link
              key={q.id || q._id}
              to={`/portal/quotes/${q.id || q._id}`}
              className={styles.activityItem}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className={styles.itemBadge}>{q.quoteNumber}</span>
              <div className={styles.itemContent}>
                <span className={styles.itemTitle}>{q.title}</span>
                <span className={styles.itemMeta}>{formatDate(q.createdAt)}</span>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.itemAmount}>{formatCurrency(q.totalAmount)}</span>
                <QuoteStatusBadge status={q.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentProjects({ projects }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Proyectos Recientes</h3>
        <Link to="/portal/projects" className={styles.viewAll}>Ver todos</Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="No hay proyectos recientes" />
      ) : (
        <div className={styles.activityList}>
          {projects.map((p) => {
            const pct = parseFloat(p.paidPercentage) || 0;
            return (
              <div key={p.id || p._id} className={styles.activityItem}>
                <span className={styles.itemBadge}>{p.projectNumber}</span>
                <div className={styles.itemContent}>
                  <span className={styles.itemTitle}>{p.title}</span>
                  <div className={styles.miniProgress}>
                    <div className={styles.miniTrack}>
                      <div
                        className={p.isFullyPaid ? styles.miniBarComplete : styles.miniBar}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className={styles.miniLabel}>{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <ProjectStatusBadge status={p.status} />
                  <Link to={`/portal/projects/${p.id || p._id}`} className={styles.viewLink}>
                    Ver
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentPayments({ payments }) {
  if (!payments.length) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Pagos Recientes</h3>
      </div>

      <div>
        {payments.map((pay) => (
          <div key={pay.id || pay._id} className={styles.paymentRow}>
            <span className={styles.paymentDate}>{formatDate(pay.paymentDate)}</span>
            <span className={styles.paymentAmount}>{formatCurrency(pay.amount)}</span>
            <span className={styles.paymentMethod}>{getPaymentMethodLabel(pay.paymentMethod)}</span>
            {pay.project ? (
              <Link
                to={`/portal/projects/${pay.project.id || pay.project._id}`}
                className={styles.paymentProject}
              >
                {pay.project.projectNumber}
              </Link>
            ) : (
              <span className={styles.paymentDate}>—</span>
            )}
            <span className={styles.paymentPct}>
              {parseFloat(pay.percentageEquivalent || 0).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
