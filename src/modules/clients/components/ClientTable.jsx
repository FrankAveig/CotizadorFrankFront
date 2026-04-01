import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import styles from './ClientTable.module.css';

const COLUMNS = [
  { key: 'businessName', label: 'Razón Social' },
  { key: 'contactName', label: 'Contacto' },
  { key: 'email', label: 'Correo' },
  { key: 'phone', label: 'Teléfono' },
  {
    key: 'isActive',
    label: 'Estado',
    render: (val) => (
      <Badge variant={val ? 'success' : 'danger'}>
        {val ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Acciones',
    render: (_, row) => null,
  },
];

export default function ClientTable({ clients = [], loading, onView, onEdit, onDelete }) {
  const columns = COLUMNS.map((col) => {
    if (col.key !== 'actions') return col;
    return {
      ...col,
      render: (_, row) => (
        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={() => onView(row.id)}>
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.id)}>
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row)}
            className={styles.deleteBtn}
          >
            Desactivar
          </Button>
        </div>
      ),
    };
  });

  return (
    <div className={styles.tableWrapper}>
      <Table columns={columns} data={clients} loading={loading} emptyMessage="No se encontraron clientes" />
    </div>
  );
}
