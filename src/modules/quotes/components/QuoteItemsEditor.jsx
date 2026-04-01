import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { formatCurrency } from '../../../core/utils/formatCurrency';
import styles from './QuoteItemsEditor.module.css';

const EMPTY_ITEM = {
  title: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
};

const QuoteItemsEditor = ({ items = [], onChange, errors = {} }) => {
  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    });
    onChange(updated);
  };

  const handleAddItem = () => {
    onChange([...items, { ...EMPTY_ITEM }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const getItemSubtotal = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return qty * price;
  };

  const grandSubtotal = items.reduce((sum, item) => sum + getItemSubtotal(item), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Ítems de la cotización</span>
      </div>

      {typeof errors.items === 'string' && (
        <p className={styles.error}>{errors.items}</p>
      )}

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          No hay ítems. Agregue al menos uno para continuar.
        </div>
      ) : (
        <div className={styles.itemsList}>
          {items.map((item, index) => (
            <div key={index} className={styles.itemCard}>
              <span className={styles.itemNumber}>{index + 1}</span>

              {items.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(index)}
                  aria-label={`Eliminar ítem ${index + 1}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}

              <div className={styles.fullWidth}>
                <Input
                  label="Título"
                  name={`item-title-${index}`}
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  error={errors[`items[${index}].title`]}
                  placeholder="Nombre del servicio o producto"
                  required
                />
              </div>

              <div className={styles.fullWidth}>
                <TextArea
                  label="Descripción"
                  name={`item-desc-${index}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Descripción del ítem (opcional)"
                  rows={2}
                />
              </div>

              <div className={styles.numberFields}>
                <Input
                  label="Cantidad"
                  name={`item-qty-${index}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  error={errors[`items[${index}].quantity`]}
                  placeholder="1"
                  required
                />
                <Input
                  label="Precio Unitario"
                  name={`item-price-${index}`}
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  error={errors[`items[${index}].unitPrice`]}
                  placeholder="0.00"
                  required
                />
                <div className={styles.subtotalDisplay}>
                  <span className={styles.subtotalLabel}>Subtotal:</span>
                  {formatCurrency(getItemSubtotal(item))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={styles.addBtn} onClick={handleAddItem}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Agregar ítem
      </button>

      {items.length > 0 && (
        <div className={styles.grandTotal}>
          <span className={styles.grandTotalLabel}>Subtotal General:</span>
          <span className={styles.grandTotalValue}>{formatCurrency(grandSubtotal)}</span>
        </div>
      )}
    </div>
  );
};

export default QuoteItemsEditor;
