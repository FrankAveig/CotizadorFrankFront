import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { QUOTE_STATUSES } from '../../../core/constants/statuses';
import styles from './QuoteFilters.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...Object.values(QUOTE_STATUSES).map((s) => ({ value: s.value, label: s.label })),
];

const QuoteFilters = ({ filters, onFilterChange, clients = [] }) => {
  const clientOptions = [
    { value: '', label: 'Todos los clientes' },
    ...clients.map((c) => ({ value: c.id, label: c.businessName })),
  ];

  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <SearchInput
          value={filters.search || ''}
          onChange={(value) => onFilterChange({ ...filters, search: value })}
          placeholder="Buscar cotizaciones..."
        />
      </div>

      <div className={styles.selectWrap}>
        <Select
          name="statusFilter"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          options={STATUS_OPTIONS}
        />
      </div>

      {clients.length > 0 && (
        <div className={styles.selectWrap}>
          <Select
            name="clientFilter"
            value={filters.clientId || ''}
            onChange={(e) => onFilterChange({ ...filters, clientId: e.target.value })}
            options={clientOptions}
          />
        </div>
      )}
    </div>
  );
};

export default QuoteFilters;
