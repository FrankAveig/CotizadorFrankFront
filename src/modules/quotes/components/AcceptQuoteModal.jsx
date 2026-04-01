import { useState, useEffect, useMemo } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './AcceptQuoteModal.module.css';

const AcceptQuoteModal = ({ isOpen, onClose, quote, onAccept, loading }) => {
  const [mode, setMode] = useState('full');
  const [selectedIds, setSelectedIds] = useState([]);
  const [notes, setNotes] = useState('');

  const items = quote?.items || [];

  useEffect(() => {
    if (isOpen) {
      setMode('full');
      setSelectedIds(items.map((item) => item.id));
      setNotes('');
    }
  }, [isOpen]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'full') {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const handleToggleItem = (itemId) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const acceptedTotal = useMemo(() => {
    return items
      .filter((item) => selectedIds.includes(item.id))
      .reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        return sum + qty * price;
      }, 0);
  }, [items, selectedIds]);

  const handleConfirm = () => {
    const payload = {
      acceptanceType: mode === 'full' ? 'full' : 'partial',
      notes: notes.trim() || undefined,
    };
    if (mode === 'partial') {
      payload.acceptedItemIds = selectedIds;
    }
    onAccept(payload);
  };

  const isValid = mode === 'full' || selectedIds.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aceptar Cotización" size="md">
      <div className={styles.content}>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={mode === 'full' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => handleModeChange('full')}
          >
            Aceptación Total
          </button>
          <button
            type="button"
            className={mode === 'partial' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => handleModeChange('partial')}
          >
            Aceptación Parcial
          </button>
        </div>

        <span className={mode === 'full' ? styles.typeFull : styles.typePartial}>
          {mode === 'full' ? 'Aceptación Total' : 'Aceptación Parcial'}
        </span>

        <div className={styles.itemsList}>
          {items.map((item) => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.unitPrice) || 0;
            const subtotal = qty * price;
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={isSelected ? styles.itemRowSelected : styles.itemRow}
                onClick={() => mode === 'partial' && handleToggleItem(item.id)}
                role={mode === 'partial' ? 'button' : undefined}
                style={{ cursor: mode === 'partial' ? 'pointer' : 'default' }}
              >
                {mode === 'partial' && (
                  <input
                    type="checkbox"
                    className={styles.itemCheckbox}
                    checked={isSelected}
                    onChange={() => handleToggleItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemMeta}>
                    {qty} × {formatCurrency(price)}
                  </div>
                </div>
                <span className={styles.itemSubtotal}>{formatCurrency(subtotal)}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.summaryBar}>
          <span className={styles.summaryLabel}>
            Total {mode === 'partial' ? 'aceptado' : ''}
          </span>
          <span className={styles.summaryValue}>{formatCurrency(acceptedTotal)}</span>
        </div>

        <div className={styles.notesSection}>
          <label className={styles.notesLabel}>Notas (opcional)</label>
          <textarea
            className={styles.notesInput}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Comentarios adicionales sobre la aceptación..."
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!isValid}
          >
            Confirmar Aceptación
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptQuoteModal;
