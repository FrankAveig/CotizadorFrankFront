import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import DownloadDocumentButton from '../../modules/documents/components/DownloadDocumentButton';
import { getDocumentById } from '../../modules/documents/services/documents.service';
import { formatDate } from '../../core/utils/formatDate';
import styles from './DocumentViewerPage.module.css';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  if (Number.isNaN(num) || num === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function DocumentViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const { data: res } = await getDocumentById(id);
        setDocument(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el documento.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Loader fullPage />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className={styles.page}>
        <PageHeader title="Documento" />
        <div className={styles.error}>
          <p>{error || 'Documento no encontrado.'}</p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Detalle de Documento">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </PageHeader>

      <Card title="Información del Documento">
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nombre</span>
            <span className={styles.infoValue}>
              {document.name || document.fileName || '—'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tipo</span>
            <span className={styles.infoValue}>
              {document.type || document.mimeType || '—'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de creación</span>
            <span className={styles.infoValue}>
              {formatDate(document.createdAt)}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tamaño</span>
            <span className={styles.infoValue}>
              {formatFileSize(document.size || document.fileSize)}
            </span>
          </div>
        </div>
      </Card>

      {(document.quote || document.project || document.client) && (
        <Card title="Entidades Relacionadas">
          <div className={styles.infoGrid}>
            {document.client && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cliente</span>
                <span className={styles.infoValue}>
                  {document.client.businessName || document.client.contactName || '—'}
                </span>
              </div>
            )}
            {document.quote && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cotización</span>
                <span className={styles.infoValue}>
                  {document.quote.quoteNumber || '—'}
                </span>
              </div>
            )}
            {document.project && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Proyecto</span>
                <span className={styles.infoValue}>
                  {document.project.projectNumber || '—'}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className={styles.downloadSection}>
        <DownloadDocumentButton
          documentId={id}
          fileName={document.name || document.fileName}
        />
      </div>
    </div>
  );
}
