import { Link } from 'react-router-dom';
import ProjectStatusBadge from './ProjectStatusBadge';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const projectId = project._id || project.id;
  const totalAmount = parseFloat(project.totalAmount) || 0;
  const paidAmount = parseFloat(project.paidAmount) || 0;
  const pendingAmount = parseFloat(project.pendingAmount) || 0;
  const paidPercentage = parseFloat(project.paidPercentage) || 0;
  const clientName =
    project.client?.businessName || project.client?.contactName || '—';

  return (
    <Link to={`/projects/${projectId}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.projectNumber}>{project.projectNumber}</span>
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className={styles.client}>
        <span className={styles.label}>Cliente:</span>
        <span className={styles.value}>{clientName}</span>
      </div>

      <div className={styles.financials}>
        <div className={styles.finRow}>
          <span className={styles.label}>Total:</span>
          <span className={styles.amount}>{formatCurrency(totalAmount)}</span>
        </div>
        <div className={styles.finRow}>
          <span className={styles.label}>Pagado:</span>
          <span className={`${styles.amount} ${styles.paid}`}>
            {formatCurrency(paidAmount)}
          </span>
        </div>
        <div className={styles.finRow}>
          <span className={styles.label}>Pendiente:</span>
          <span className={`${styles.amount} ${styles.pending}`}>
            {formatCurrency(pendingAmount)}
          </span>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.label}>Progreso de pago</span>
          <span className={styles.percentage}>{paidPercentage.toFixed(1)}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${Math.min(paidPercentage, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
