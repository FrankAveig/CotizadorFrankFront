import { Link } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import styles from './ClientCard.module.css';

const ClientCard = ({ client }) => {
  const clientId = client._id || client.id;

  return (
    <Link to={`/clients/${clientId}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.businessName}>{client.businessName}</h3>
        <Badge variant={client.isActive ? 'success' : 'danger'}>
          {client.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
      <div className={styles.body}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Contacto:</span>
          <span className={styles.value}>{client.contactName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Correo:</span>
          <span className={styles.value}>{client.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Teléfono:</span>
          <span className={styles.value}>{client.phone}</span>
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;
