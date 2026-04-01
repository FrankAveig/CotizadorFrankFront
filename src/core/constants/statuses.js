export const QUOTE_STATUSES = {
  DRAFT: {
    value: 'draft',
    label: 'Borrador',
    color: '#6b7280',
  },
  ISSUED: {
    value: 'issued',
    label: 'Emitida',
    color: '#3b82f6',
  },
  SENT: {
    value: 'sent',
    label: 'Enviada',
    color: '#6366f1',
  },
  VIEWED: {
    value: 'viewed',
    label: 'Vista',
    color: '#8b5cf6',
  },
  PARTIALLY_ACCEPTED: {
    value: 'partially_accepted',
    label: 'Parcialmente aceptada',
    color: '#f59e0b',
  },
  FULLY_ACCEPTED: {
    value: 'fully_accepted',
    label: 'Aceptada',
    color: '#22c55e',
  },
  REJECTED: {
    value: 'rejected',
    label: 'Rechazada',
    color: '#ef4444',
  },
  EXPIRED: {
    value: 'expired',
    label: 'Expirada',
    color: '#78716c',
  },
  CANCELED: {
    value: 'canceled',
    label: 'Cancelada',
    color: '#64748b',
  },
};

export const PROJECT_STATUSES = {
  PENDING_START: {
    value: 'pending_start',
    label: 'Pendiente de inicio',
    color: '#f59e0b',
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'En progreso',
    color: '#3b82f6',
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completado',
    color: '#22c55e',
  },
  CANCELED: {
    value: 'canceled',
    label: 'Cancelado',
    color: '#64748b',
  },
};

export const PAYMENT_METHODS = {
  TRANSFER: {
    value: 'transfer',
    label: 'Transferencia',
  },
  CASH: {
    value: 'cash',
    label: 'Efectivo',
  },
  CARD: {
    value: 'card',
    label: 'Tarjeta',
  },
  PAYPAL: {
    value: 'paypal',
    label: 'PayPal',
  },
  BANK_DEPOSIT: {
    value: 'bank_deposit',
    label: 'Depósito bancario',
  },
  OTHER: {
    value: 'other',
    label: 'Otro',
  },
};

export const ITEM_STATUSES = {
  PENDING: {
    value: 'pending',
    label: 'Pendiente',
  },
  ACCEPTED: {
    value: 'accepted',
    label: 'Aceptado',
  },
  REJECTED: {
    value: 'rejected',
    label: 'Rechazado',
  },
};

/** Ítems de proyecto (workflow de ejecución) — distinto de ítems de cotización */
export const PROJECT_ITEM_STATUSES = {
  PENDING: {
    value: 'pending',
    label: 'Pendiente',
  },
  IN_PROGRESS: {
    value: 'in_progress',
    label: 'En progreso',
  },
  COMPLETED: {
    value: 'completed',
    label: 'Completado',
  },
  CANCELED: {
    value: 'canceled',
    label: 'Cancelado',
  },
};
