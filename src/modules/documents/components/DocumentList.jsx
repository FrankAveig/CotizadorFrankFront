import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import DownloadDocumentButton from './DownloadDocumentButton';
import { formatDate } from '../../../core/utils/formatDate';
import styles from './DocumentList.module.css';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  if (Number.isNaN(num) || num === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function DocumentList({
  documents = [],
  loading = false,
  emptyTitle = 'Sin documentos',
  emptyMessage = 'No hay documentos asociados.',
}) {
  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <Loader size="md" />
      </div>
    );
  }

  if (!documents.length) {
    return (
      <EmptyState title={emptyTitle} message={emptyMessage} />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nombre</th>
            <th className={styles.th}>Tipo</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Tamaño</th>
            <th className={styles.th}>Descargar</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, idx) => (
            <tr key={doc._id || doc.id || idx} className={styles.tr}>
              <td className={styles.td}>{doc.name || doc.fileName || '—'}</td>
              <td className={styles.td}>{doc.type || doc.mimeType || '—'}</td>
              <td className={styles.td}>{formatDate(doc.createdAt)}</td>
              <td className={styles.td}>{formatFileSize(doc.size || doc.fileSize)}</td>
              <td className={styles.td}>
                <DownloadDocumentButton
                  documentId={doc._id || doc.id}
                  fileName={doc.name || doc.fileName}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
