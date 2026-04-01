import { useState, useMemo, useCallback } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './PortalAcceptQuoteModal.module.css';

const ACCEPTANCE_FULL = 'full';
const ACCEPTANCE_PARTIAL = 'partial';

export default function PortalAcceptQuoteModal({
  isOpen,
  onClose,
  quote,
  onAccept,
  loading = false,
}) {
  const [acceptanceType, setAcceptanceType] = useState(ACCEPTANCE_FULL);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [notes, setNotes] = useState('');

  const items = quote?.items || [];

  const totalQuoteAmount = useMemo(
    () => items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0),
    [items],
  );

  const totalAccepted = useMemo(() => {
    if (acceptanceType === ACCEPTANCE_FULL) return totalQuoteAmount;
    return items
      .filter((item) => selectedIds.has(item.id))
      .reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);
  }, [acceptanceType, items, selectedIds, totalQuoteAmount]);

  const handleToggleType = useCallback((type) => {
    setAcceptanceType(type);
    if (type === ACCEPTANCE_FULL) {
      setSelectedIds(new Set());
    }
  }, []);

  const handleToggleItem = useCallback((itemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  }, [items, selectedIds.size]);

  const canSubmit =
    acceptanceType === ACCEPTANCE_FULL || selectedIds.size > 0;

  const handleConfirm = () => {
    if (!canSubmit) return;

    const payload = {
      acceptanceType: acceptanceType === ACCEPTANCE_FULL ? 'full' : 'partial',
      notes: notes.trim() || undefined,
    };

    if (acceptanceType === ACCEPTANCE_PARTIAL) {
      payload.acceptedItemIds = Array.from(selectedIds);
    }

    onAccept(payload);
  };

  const handleClose = () => {
    setAcceptanceType(ACCEPTANCE_FULL);
    setSelectedIds(new Set());
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Aceptar Cotización" size="lg">
      <div className={styles.container}>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${acceptanceType === ACCEPTANCE_FULL ? styles.toggleActive : ''}`}
            onClick={() => handleToggleType(ACCEPTANCE_FULL)}
          >
            Aceptar Todo
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${acceptanceType === ACCEPTANCE_PARTIAL ? styles.toggleActive : ''}`}
            onClick={() => handleToggleType(ACCEPTANCE_PARTIAL)}
          >
            Selección Parcial
          </button>
        </div>

        <div className={styles.badgeRow}>
          <span
            className={`${styles.badge} ${
              acceptanceType === ACCEPTANCE_FULL ? styles.badgeFull : styles.badgePartial
            }`}
          >
            {acceptanceType === ACCEPTANCE_FULL
              ? 'Aceptación Total'
              : 'Aceptación Parcial'}
          </span>
        </div>

        <div className={styles.itemsList}>
          <div className={styles.itemsHeader}>
            <span className={styles.itemsTitle}>Ítems de la cotización</span>
            {acceptanceType === ACCEPTANCE_PARTIAL && (
              <button
                type="button"
                className={styles.selectAllBtn}
                onClick={handleSelectAll}
              >
                {selectedIds.size === items.length
                  ? 'Deseleccionar todo'
                  : 'Seleccionar todo'}
              </button>
            )}
          </div>

          {items.map((item) => {
            const subtotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
            const isSelected =
              acceptanceType === ACCEPTANCE_FULL || selectedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`${styles.itemRow} ${isSelected ? styles.itemSelected : ''}`}
              >
                {acceptanceType === ACCEPTANCE_PARTIAL && (
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                    />
                    <span className={styles.checkboxCustom}>
                      {selectedIds.has(item.id) && (
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </label>
                )}
                <div className={styles.itemContent}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemName}>{item.title}</span>
                    <span className={styles.itemSubtotal}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {item.description && (
                    <p className={styles.itemDesc}>
                      {item.description.length > 100
                        ? `${item.description.slice(0, 100)}...`
                        : item.description}
                    </p>
                  )}
                  <div className={styles.itemMeta}>
                    <span>Cant: {item.quantity}</span>
                    <span>P. Unit: {formatCurrency(item.unitPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.notesSection}>
          <label className={styles.notesLabel} htmlFor="accept-notes">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="accept-notes"
            className={styles.notesInput}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe cualquier comentario o instrucción adicional..."
          />
        </div>

        <div className={styles.summaryBar}>
          <div className={styles.summaryInfo}>
            <span className={styles.summaryLabel}>Total a aceptar:</span>
            <span className={styles.summaryAmount}>
              {formatCurrency(totalAccepted)}
            </span>
          </div>
          {acceptanceType === ACCEPTANCE_PARTIAL && (
            <span className={styles.summaryCount}>
              {selectedIds.size} de {items.length} ítems
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!canSubmit}
          >
            Confirmar Aceptación
          </Button>
        </div>
      </div>
    </Modal>
  );
}
