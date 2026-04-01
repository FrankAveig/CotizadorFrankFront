import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ClientTable from '../../modules/clients/components/ClientTable';
import ClientFilters from '../../modules/clients/components/ClientFilters';
import { getClients, deleteClient } from '../../modules/clients/services/clients.service';
import { useApp } from '../../context/AppContext';
import styles from './ClientsPage.module.css';

const INITIAL_FILTERS = {
  search: '',
  isActive: '',
  page: 1,
  limit: 10,
};

export default function ClientsPage() {
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: filters.page, limit: filters.limit };
      if (filters.search) params.search = filters.search;
      if (filters.isActive) params.isActive = filters.isActive;

      const response = await getClients(params);
      const result = response.data;
      setClients(result.data?.data || []);
      setPagination(result.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError('Error al cargar los clientes');
      addNotification('error', 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, [filters, addNotification]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleView = (id) => navigate(`/clients/${id}`);
  const handleEdit = (id) => navigate(`/clients/${id}/edit`);

  const handleDeleteClick = (client) => {
    setDeleteTarget(client);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      addNotification('success', 'Cliente desactivado correctamente');
      setDeleteTarget(null);
      fetchClients();
    } catch (err) {
      addNotification('error', err.response?.data?.message || 'Error al desactivar el cliente');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Clientes" subtitle="Gestión de clientes">
        <Button variant="primary" onClick={() => navigate('/clients/new')}>
          Nuevo Cliente
        </Button>
      </PageHeader>

      <div className={styles.filtersSection}>
        <ClientFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {error && (
        <div className={styles.errorState}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchClients}>Reintentar</Button>
        </div>
      )}

      {!error && (
        <>
          <ClientTable
            clients={clients}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {!loading && pagination.totalPages > 1 && (
            <div className={styles.paginationSection}>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Desactivar Cliente"
        message={`¿Está seguro que desea desactivar al cliente "${deleteTarget?.businessName}"?`}
        confirmText="Desactivar"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
