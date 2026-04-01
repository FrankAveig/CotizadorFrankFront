import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import PortalDocumentDownloadButton from '../../modules/portal/components/PortalDocumentDownloadButton';
import { getPortalQuoteById, acceptPortalQuote } from '../../modules/portal/services/portal-quotes.service';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import styles from './PortalQuoteDetailPage.module.css';

const CAN_ACCEPT_STATUSES = ['issued', 'sent', 'viewed'];

export default function PortalQuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null });
  const [acceptNotes, setAcceptNotes] = useState('');

  const fetchQuote = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPortalQuoteById(id);
      setQuote(response.data?.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar la cotización');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const items = useMemo(() => quote?.items || [], [quote]);
  const canAccept = quote ? CAN_ACCEPT_STATUSES.includes(quote.status) : false;
  const documents = quote?.documents || [];

  const selectedTotal = useMemo(() => {
    return items
      .filter((item) => selectedItemIds.has(item.id))
      .reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  }, [items, selectedItemIds]);

  const allSelected = items.length > 0 && selectedItemIds.size === items.length;

  const handleToggleItem = useCallback((itemId) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(items.map((i) => i.id)));
    }
  }, [allSelected, items]);

  const openConfirmModal = (type) => {
    setConfirmModal({ open: true, type });
    setAcceptNotes('');
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, type: null });
    setAcceptNotes('');
  };

  const handleConfirmAccept = async () => {
    const { type } = confirmModal;

    const payload = {
      acceptanceType: type,
      notes: acceptNotes.trim() || undefined,
    };

    if (type === 'partial') {
      payload.acceptedItemIds = Array.from(selectedItemIds);
    }

    try {
      setActionLoading(true);
      const response = await acceptPortalQuote(id, payload);
      closeConfirmModal();
      addNotification('success', 'Cotización aceptada exitosamente. Se ha creado un nuevo proyecto.');

      const projectData = response.data?.data?.project;
      if (projectData?.id) {
        navigate(`/portal/projects/${projectData.id}`);
      } else {
        fetchQuote();
      }
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al aceptar la cotización');
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
          <Button variant="secondary" onClick={fetchQuote}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const confirmingFull = confirmModal.open && confirmModal.type === 'full';
  const confirmingPartial = confirmModal.open && confirmModal.type === 'partial';
  const selectedItemsForConfirm = items.filter((item) => selectedItemIds.has(item.id));

  return (
    <div className={styles.page}>
      <Link to="/portal/quotes" className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a cotizaciones
      </Link>

      <PageHeader
        title={quote.title || 'Cotización'}
        subtitle={`#${quote.quoteNumber || ''}`}
      >
        <QuoteStatusBadge status={quote.status} />
      </PageHeader>

      {/* Info + Financial Summary */}
      <div className={styles.topSection}>
        <Card>
          <div className={styles.infoGrid}>
            {quote.issuedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de emisión</span>
                <span className={styles.infoValue}>{formatDate(quote.issuedAt)}</span>
              </div>
            )}
            {quote.sentAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de envío</span>
                <span className={styles.infoValue}>{formatDate(quote.sentAt)}</span>
              </div>
            )}
            {quote.viewedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Visualizada</span>
                <span className={styles.infoValue}>{formatDate(quote.viewedAt)}</span>
              </div>
            )}
            {quote.validUntil && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Válida hasta</span>
                <span className={styles.infoValue}>{formatDate(quote.validUntil)}</span>
              </div>
            )}
          </div>
          {quote.description && (
            <div className={styles.descriptionBlock}>
              <span className={styles.infoLabel}>Descripción</span>
              <p className={styles.descriptionText}>{quote.description}</p>
            </div>
          )}
        </Card>

        <Card title="Resumen Financiero">
          <div className={styles.financialSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            {(parseFloat(quote.discountAmount) || 0) > 0 && (
              <div className={styles.summaryRow}>
                <span>Descuento</span>
                <span className={styles.discount}>-{formatCurrency(quote.discountAmount)}</span>
              </div>
            )}
            {(parseFloat(quote.taxAmount) || 0) > 0 && (
              <div className={styles.summaryRow}>
                <span>Impuesto</span>
                <span>{formatCurrency(quote.taxAmount)}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{formatCurrency(quote.totalAmount)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Items with checkboxes */}
      <Card>
        <div className={styles.itemsHeader}>
          <h3 className={styles.itemsTitle}>Ítems de la cotización</h3>
          {canAccept && items.length > 0 && (
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                onChange={handleToggleAll}
              />
              <span className={styles.checkboxCustom}>
                {allSelected && (
                  <svg viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              Seleccionar todos
            </label>
          )}
        </div>

        <div className={styles.itemsTable}>
          <div className={`${styles.itemsTableHead} ${canAccept ? styles.withCheck : styles.noCheck}`}>
            {canAccept && <div className={styles.colCheck} />}
            <div className={styles.colNum}>#</div>
            <div className={styles.colTitle}>Descripción</div>
            <div className={styles.colQty}>Cant.</div>
            <div className={styles.colPrice}>P. Unitario</div>
            <div className={styles.colSubtotal}>Subtotal</div>
          </div>

          {items.length === 0 && (
            <div className={styles.emptyItems}>No hay ítems en esta cotización.</div>
          )}

          {items.map((item, idx) => {
            const isSelected = selectedItemIds.has(item.id);
            return (
              <div
                key={item.id}
                className={`${styles.itemRow} ${canAccept ? styles.withCheck : styles.noCheck} ${isSelected ? styles.itemRowSelected : ''}`}
                onClick={canAccept ? () => handleToggleItem(item.id) : undefined}
              >
                {canAccept && (
                  <div className={styles.colCheck}>
                    <label className={styles.checkboxLabel} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        onChange={() => handleToggleItem(item.id)}
                      />
                      <span className={styles.checkboxCustom}>
                        {isSelected && (
                          <svg viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </label>
                  </div>
                )}
                <div className={styles.colNum}>{idx + 1}</div>
                <div className={styles.colTitle}>
                  <span className={styles.itemName}>{item.title}</span>
                  {item.description && (
                    <span className={styles.itemDesc}>{item.description}</span>
                  )}
                </div>
                <div className={styles.colQty}>{parseFloat(item.quantity) || 0}</div>
                <div className={styles.colPrice}>{formatCurrency(item.unitPrice)}</div>
                <div className={styles.colSubtotal}>{formatCurrency(item.subtotal)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Accept action buttons */}
      {canAccept && items.length > 0 && (
        <div className={styles.acceptSection}>
          <div className={styles.acceptInfo}>
            {selectedItemIds.size > 0 && (
              <div className={styles.selectionSummary}>
                <span className={styles.selectionCount}>
                  {selectedItemIds.size} de {items.length} ítems seleccionados
                </span>
                <span className={styles.selectionTotal}>
                  Total seleccionado: <strong>{formatCurrency(selectedTotal)}</strong>
                </span>
              </div>
            )}
          </div>
          <div className={styles.acceptButtons}>
            <Button
              variant="primary"
              onClick={() => openConfirmModal('full')}
              disabled={actionLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Aceptar Todo
            </Button>
            <Button
              variant="secondary"
              onClick={() => openConfirmModal('partial')}
              disabled={actionLoading || selectedItemIds.size === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Aceptar Seleccionados ({selectedItemIds.size})
            </Button>
          </div>
        </div>
      )}

      {/* Notes */}
      {quote.notes && (
        <Card title="Notas">
          <p className={styles.notesText}>{quote.notes}</p>
        </Card>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <Card title="Documentos">
          <div className={styles.docList}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.docItem}>
                <div className={styles.docInfo}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.docIcon}>
                    <path d="M4 1h5l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span>{doc.fileName || 'Documento'}</span>
                </div>
                <PortalDocumentDownloadButton document={doc} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Confirm Full Acceptance Modal */}
      <Modal
        isOpen={confirmingFull}
        onClose={closeConfirmModal}
        title="Confirmar Aceptación Total"
        size="md"
      >
        <div className={styles.confirmContent}>
          <div className={styles.confirmIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#22c55e" strokeWidth="2.5" fill="#f0fdf4" />
              <path d="M15 24l6 6 12-12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={styles.confirmText}>
            Está a punto de aceptar <strong>todos los ítems</strong> de esta cotización.
          </p>
          <div className={styles.confirmSummary}>
            <div className={styles.confirmSummaryRow}>
              <span>Ítems</span>
              <span>{items.length}</span>
            </div>
            <div className={`${styles.confirmSummaryRow} ${styles.confirmSummaryTotal}`}>
              <span>Total</span>
              <span>{formatCurrency(quote.totalAmount)}</span>
            </div>
          </div>
          <div className={styles.notesField}>
            <label className={styles.notesFieldLabel} htmlFor="accept-notes-full">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="accept-notes-full"
              className={styles.notesInput}
              rows={3}
              value={acceptNotes}
              onChange={(e) => setAcceptNotes(e.target.value)}
              placeholder="Comentarios o instrucciones adicionales..."
              maxLength={2000}
            />
          </div>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={closeConfirmModal} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmAccept} loading={actionLoading}>
              Confirmar Aceptación Total
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Partial Acceptance Modal */}
      <Modal
        isOpen={confirmingPartial}
        onClose={closeConfirmModal}
        title="Confirmar Aceptación Parcial"
        size="md"
      >
        <div className={styles.confirmContent}>
          <div className={styles.confirmIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#f59e0b" strokeWidth="2.5" fill="#fffbeb" />
              <path d="M15 24l6 6 12-12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={styles.confirmText}>
            Está a punto de aceptar <strong>{selectedItemIds.size} de {items.length} ítems</strong> de esta cotización.
            Los ítems no seleccionados serán rechazados.
          </p>
          <div className={styles.confirmItemsList}>
            <span className={styles.confirmItemsLabel}>Ítems a aceptar:</span>
            {selectedItemsForConfirm.map((item) => (
              <div key={item.id} className={styles.confirmItemRow}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.confirmItemName}>{item.title}</span>
                <span className={styles.confirmItemPrice}>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className={styles.confirmSummary}>
            <div className={styles.confirmSummaryRow}>
              <span>Ítems seleccionados</span>
              <span>{selectedItemIds.size} de {items.length}</span>
            </div>
            <div className={`${styles.confirmSummaryRow} ${styles.confirmSummaryTotal}`}>
              <span>Total a aceptar</span>
              <span>{formatCurrency(selectedTotal)}</span>
            </div>
          </div>
          <div className={styles.notesField}>
            <label className={styles.notesFieldLabel} htmlFor="accept-notes-partial">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="accept-notes-partial"
              className={styles.notesInput}
              rows={3}
              value={acceptNotes}
              onChange={(e) => setAcceptNotes(e.target.value)}
              placeholder="Razón de la selección parcial, instrucciones, etc..."
              maxLength={2000}
            />
          </div>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={closeConfirmModal} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmAccept} loading={actionLoading}>
              Confirmar Aceptación Parcial
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
