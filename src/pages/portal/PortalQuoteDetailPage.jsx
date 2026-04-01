import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import QuoteStatusBadge from '../../modules/quotes/components/QuoteStatusBadge';
import PortalDocumentDownloadButton from '../../modules/portal/components/PortalDocumentDownloadButton';
import { getPortalQuoteById, acceptPortalQuote, rejectPortalQuote } from '../../modules/portal/services/portal-quotes.service';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { ITEM_STATUSES } from '../../core/constants/statuses';
import styles from './PortalQuoteDetailPage.module.css';

const quoteItemStatusLabel = (status) => {
  const found = Object.values(ITEM_STATUSES).find((s) => s.value === status);
  if (found) return found.label;
  return status || 'Pendiente';
};

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
  const [rejectNotes, setRejectNotes] = useState('');

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
  /** Hay ítems marcados pero no todos: solo aceptación parcial hasta que desmarque o marque todos */
  const partialSelectionActive =
    items.length > 0 &&
    selectedItemIds.size > 0 &&
    selectedItemIds.size < items.length;

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
    setRejectNotes('');
  };

  const openRejectModal = () => {
    setConfirmModal({ open: true, type: 'reject' });
    setRejectNotes('');
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

  const handleConfirmReject = async () => {
    try {
      setActionLoading(true);
      await rejectPortalQuote(id, {
        notes: rejectNotes.trim() || undefined,
      });
      closeConfirmModal();
      addNotification('success', 'Has rechazado esta cotización.');
      fetchQuote();
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al rechazar la cotización');
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

  const showItemAcceptanceStatus = ['partially_accepted', 'fully_accepted'].includes(quote.status);
  const lastPartialAcceptance =
    quote.status === 'partially_accepted' && quote.acceptances?.length
      ? quote.acceptances[quote.acceptances.length - 1]
      : null;

  const confirmingFull = confirmModal.open && confirmModal.type === 'full';
  const confirmingPartial = confirmModal.open && confirmModal.type === 'partial';
  const confirmingReject = confirmModal.open && confirmModal.type === 'reject';
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

      {lastPartialAcceptance && (
        <Card>
          <div className={styles.partialAcceptanceBanner}>
            <h3 className={styles.partialAcceptanceTitle}>Aceptación parcial</h3>
            <p className={styles.partialAcceptanceText}>
              Aceptaste ítems por un total de{' '}
              <strong>{formatCurrency(lastPartialAcceptance.acceptedTotalAmount)}</strong>
              {lastPartialAcceptance.acceptedAt && (
                <> el {formatDate(lastPartialAcceptance.acceptedAt)}.</>
              )}
            </p>
            {lastPartialAcceptance.notes && (
              <p className={styles.partialAcceptanceNotes}>
                <span className={styles.partialAcceptanceNotesLabel}>Tus notas:</span>{' '}
                {lastPartialAcceptance.notes}
              </p>
            )}
          </div>
        </Card>
      )}

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
          <div
            className={`${styles.itemsTableHead} ${canAccept ? styles.withCheck : styles.noCheck} ${showItemAcceptanceStatus ? styles.withStatusCol : ''}`}
          >
            {canAccept && <div className={styles.colCheck} />}
            <div className={styles.colNum}>#</div>
            <div className={styles.colTitle}>Descripción</div>
            <div className={styles.colQty}>Cant.</div>
            <div className={styles.colPrice}>P. Unitario</div>
            <div className={styles.colSubtotal}>Subtotal</div>
            {showItemAcceptanceStatus && (
              <div className={styles.colStatus}>Resultado</div>
            )}
          </div>

          {items.length === 0 && (
            <div className={styles.emptyItems}>No hay ítems en esta cotización.</div>
          )}

          {items.map((item, idx) => {
            const isSelected = selectedItemIds.has(item.id);
            const itemStatus = item.status || 'pending';
            const rowOutcomeClass =
              showItemAcceptanceStatus && itemStatus === 'accepted'
                ? styles.itemRowAccepted
                : showItemAcceptanceStatus && itemStatus === 'rejected'
                  ? styles.itemRowRejected
                  : '';
            return (
              <div
                key={item.id}
                className={`${styles.itemRow} ${canAccept ? styles.withCheck : styles.noCheck} ${showItemAcceptanceStatus ? styles.withStatusCol : ''} ${isSelected ? styles.itemRowSelected : ''} ${rowOutcomeClass}`}
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
                {showItemAcceptanceStatus && (
                  <div className={styles.colStatus}>
                    <span
                      className={`${styles.itemStatusBadge} ${
                        itemStatus === 'accepted'
                          ? styles.itemStatusBadgeAccepted
                          : itemStatus === 'rejected'
                            ? styles.itemStatusBadgeRejected
                            : styles.itemStatusBadgePending
                      }`}
                    >
                      {quoteItemStatusLabel(item.status)}
                    </span>
                  </div>
                )}
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
                {partialSelectionActive && (
                  <span className={styles.partialHint}>
                    «Aceptar todo» está desactivado mientras tenga una selección parcial.
                    Use «Aceptar seleccionados» o marque todos los ítems.
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={styles.acceptButtons}>
            <Button
              variant="primary"
              onClick={() => openConfirmModal('full')}
              disabled={actionLoading || partialSelectionActive}
              title={
                partialSelectionActive
                  ? 'Desmarca ítems o usa «Seleccionar todos» para aceptar la cotización completa.'
                  : undefined
              }
            >
              Aceptar todo
            </Button>
            <Button
              variant="secondary"
              onClick={() => openConfirmModal('partial')}
              disabled={actionLoading || selectedItemIds.size === 0}
            >
              Aceptar seleccionados ({selectedItemIds.size})
            </Button>
            <Button
              variant="danger"
              onClick={openRejectModal}
              disabled={actionLoading}
            >
              Rechazar cotización
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
        title="Revisar aceptación parcial"
        size="lg"
      >
        <div className={styles.confirmContent}>
          <div className={styles.partialWarning} role="alert">
            <strong>Importante:</strong> solo se incluirán en el proyecto los ítems que aparecen abajo.
            El resto de la cotización <strong>no</strong> quedará aceptado. Revise la lista y el total antes de confirmar.
          </div>
          <p className={`${styles.confirmText} ${styles.confirmTextLeft}`}>
            Va a aceptar <strong>{selectedItemIds.size} de {items.length} ítems</strong>.
            Los ítems no incluidos en esta lista no formarán parte del proyecto.
          </p>
          <div className={styles.confirmItemsList}>
            <span className={styles.confirmItemsLabel}>Ítems que quedarán aceptados</span>
            {selectedItemsForConfirm.map((item) => (
              <div key={item.id} className={styles.confirmItemRow}>
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
              Confirmar aceptación parcial
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject quote modal */}
      <Modal
        isOpen={confirmingReject}
        onClose={closeConfirmModal}
        title="Rechazar cotización"
        size="md"
      >
        <div className={styles.confirmContent}>
          <div className={styles.rejectWarning} role="alert">
            <strong>¿Seguro que desea rechazar esta cotización?</strong>
            <p className={styles.rejectWarningText}>
              Esta acción indica que no acepta la propuesta. No se creará ningún proyecto a partir de esta cotización.
            </p>
          </div>
          <div className={styles.notesField}>
            <label className={styles.notesFieldLabel} htmlFor="reject-notes">
              Motivo del rechazo (opcional, máx. 2000 caracteres)
            </label>
            <textarea
              id="reject-notes"
              className={styles.notesInput}
              rows={4}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Ej.: presupuesto, plazos, alcance…"
              maxLength={2000}
            />
          </div>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={closeConfirmModal} disabled={actionLoading}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmReject} loading={actionLoading}>
              Confirmar rechazo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
