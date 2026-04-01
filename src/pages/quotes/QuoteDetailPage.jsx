import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import QuoteSummaryCard from '../../modules/quotes/components/QuoteSummaryCard';
import QuoteItemsTable from '../../modules/quotes/components/QuoteItemsTable';
import AcceptQuoteModal from '../../modules/quotes/components/AcceptQuoteModal';
import {
  getQuoteById,
  getQuoteItems,
  getQuoteDocuments,
  issueQuote,
  sendQuote,
  acceptQuote,
  generateQuotePdf,
} from '../../modules/quotes/services/quotes.service';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../core/utils/formatDate';
import styles from './QuoteDetailPage.module.css';

export default function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [quote, setQuote] = useState(null);
  const [items, setItems] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null });
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [quoteRes, itemsRes, docsRes] = await Promise.all([
        getQuoteById(id),
        getQuoteItems(id),
        getQuoteDocuments(id).catch(() => ({ data: { data: [] } })),
      ]);
      setQuote(quoteRes.data?.data || null);
      setItems(itemsRes.data?.data || []);
      setDocuments(docsRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar la cotización');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleIssue = async () => {
    setActionLoading(true);
    try {
      await issueQuote(id);
      addNotification('success', 'Cotización emitida exitosamente');
      setConfirmDialog({ open: false, type: null });
      fetchData();
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al emitir');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSend = async () => {
    setActionLoading(true);
    try {
      await sendQuote(id);
      addNotification('success', 'Cotización enviada exitosamente');
      setConfirmDialog({ open: false, type: null });
      fetchData();
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al enviar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async (data) => {
    setActionLoading(true);
    try {
      const response = await acceptQuote(id, data);
      addNotification('success', 'Cotización aceptada exitosamente');
      setAcceptModalOpen(false);
      const projectId = response.data?.data?.projectId;
      if (projectId) {
        navigate(`/projects/${projectId}`);
      } else {
        fetchData();
      }
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al aceptar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    setActionLoading(true);
    try {
      await generateQuotePdf(id);
      addNotification('success', 'PDF generado exitosamente');
      fetchData();
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al generar PDF');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchData}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const status = quote.status;
  const isDraft = status === 'draft';
  const isIssued = status === 'issued';
  const isSentOrViewed = status === 'sent' || status === 'viewed';
  const isAccepted = status === 'fully_accepted' || status === 'partially_accepted';

  return (
    <div className={styles.page}>
      <Link to="/quotes" className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a cotizaciones
      </Link>

      <PageHeader title={quote.title || 'Cotización'} subtitle={`#${quote.quoteNumber || ''}`}>
        <div className={styles.actionButtons}>
          {isDraft && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/quotes/${id}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConfirmDialog({ open: true, type: 'issue' })}
              >
                Emitir
              </Button>
            </>
          )}
          {isIssued && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setConfirmDialog({ open: true, type: 'send' })}
            >
              Enviar
            </Button>
          )}
          {isSentOrViewed && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAcceptModalOpen(true)}
            >
              Aceptar
            </Button>
          )}
          {isAccepted && quote.projectId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/projects/${quote.projectId}`)}
            >
              Ver Proyecto
            </Button>
          )}
          {(isDraft || isIssued || isSentOrViewed) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGeneratePdf}
              loading={actionLoading}
            >
              Generar PDF
            </Button>
          )}
        </div>
      </PageHeader>

      <div className={styles.topSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <div>
              <h2 className={styles.quoteTitle}>{quote.title}</h2>
              <span className={styles.quoteNumber}>#{quote.quoteNumber}</span>
            </div>
            <QuoteStatusBadge status={quote.status} />
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cliente</span>
              <span className={styles.infoValue}>
                {quote.client?.businessName || '—'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Contacto</span>
              <span className={styles.infoValue}>
                {quote.client?.contactName || '—'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de creación</span>
              <span className={styles.infoValue}>{formatDate(quote.createdAt)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Válida hasta</span>
              <span className={styles.infoValue}>{formatDate(quote.validUntil) || '—'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Moneda</span>
              <span className={styles.infoValue}>{quote.currency || 'USD'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Última actualización</span>
              <span className={styles.infoValue}>{formatDate(quote.updatedAt)}</span>
            </div>
            {quote.description && (
              <div className={`${styles.infoItem} ${styles.description}`}>
                <span className={styles.infoLabel}>Descripción</span>
                <p className={styles.descriptionText}>{quote.description}</p>
              </div>
            )}
            {quote.notes && (
              <div className={`${styles.infoItem} ${styles.description}`}>
                <span className={styles.infoLabel}>Notas</span>
                <p className={styles.descriptionText}>{quote.notes}</p>
              </div>
            )}
          </div>
        </div>

        <QuoteSummaryCard
          subtotal={quote.subtotal}
          discountAmount={quote.discountAmount}
          taxAmount={quote.taxAmount}
          totalAmount={quote.totalAmount}
          currency={quote.currency}
        />
      </div>

      <div>
        <h3 className={styles.sectionTitle}>Ítems</h3>
        <QuoteItemsTable items={items} />
      </div>

      <div className={styles.documentsSection}>
        <h3 className={styles.sectionTitle}>Documentos</h3>
        {documents.length > 0 ? (
          <ul className={styles.docList}>
            {documents.map((doc) => (
              <li key={doc.id} className={styles.docItem}>
                <span className={styles.docIcon}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 1h5l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
                {doc.fileName || doc.originalName || 'Documento'}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noDocuments}>No hay documentos asociados.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.open && confirmDialog.type === 'issue'}
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={handleIssue}
        title="Emitir Cotización"
        message="¿Está seguro de que desea emitir esta cotización? Una vez emitida no se podrá editar."
        confirmText="Emitir"
        variant="primary"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={confirmDialog.open && confirmDialog.type === 'send'}
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={handleSend}
        title="Enviar Cotización"
        message="¿Está seguro de que desea enviar esta cotización al cliente?"
        confirmText="Enviar"
        variant="primary"
        loading={actionLoading}
      />

      <AcceptQuoteModal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        quote={{ ...quote, items }}
        onAccept={handleAccept}
        loading={actionLoading}
      />
    </div>
  );
}
