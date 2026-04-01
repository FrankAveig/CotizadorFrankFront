import { QUOTE_STATUSES } from '../../../core/constants/statuses';

const getStatusConfig = (status) => {
  const found = Object.values(QUOTE_STATUSES).find((s) => s.value === status);
  return found || { label: status || 'Desconocido', color: '#6b7280' };
};

const QuoteStatusBadge = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#fff',
        backgroundColor: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
};

export default QuoteStatusBadge;
