import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import styles from './ClientFilters.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

const ClientFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, isActive: e.target.value, page: 1 });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchField}>
        <Input
          placeholder="Buscar por nombre o correo..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          name="search"
        />
      </div>
      <div className={styles.selectField}>
        <Select
          value={filters.isActive || ''}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          name="isActive"
          placeholder="Estado"
        />
      </div>
    </div>
  );
};

export default ClientFilters;
