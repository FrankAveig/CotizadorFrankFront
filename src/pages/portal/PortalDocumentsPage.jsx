import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import PortalDocumentDownloadButton from '../../modules/portal/components/PortalDocumentDownloadButton';
import { getPortalDocuments } from '../../modules/portal/services/portal-documents.service';
import { usePagination } from '../../core/hooks/usePagination';
import { formatDate } from '../../core/utils/formatDate';
import styles from './PortalDocumentsPage.module.css';

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'invoice_pdf', label: 'Factura' },
  { value: 'quote_pdf', label: 'PDF de Cotización' },
  { value: 'acceptance_pdf', label: 'PDF de Aceptación' },
  { value: 'payment_receipt', label: 'Recibo de Pago' },
  { value: 'contract', label: 'Contrato' },
  { value: 'other', label: 'Otro' },
];

const TYPE_LABELS = {
  invoice_pdf: 'Factura',
  quote_pdf: 'PDF de Cotización',
  acceptance_pdf: 'PDF de Aceptación',
  payment_receipt: 'Recibo de Pago',
  contract: 'Contrato',
  other: 'Otro',
};

function formatFileSize(bytes) {
  const size = parseFloat(bytes);
  if (!size || isNaN(size)) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalDocumentsPage() {
  const { page, limit, goToPage } = usePagination();

  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit };
      if (typeFilter) params.documentType = typeFilter;

      const response = await getPortalDocuments(params);
      const result = response.data;
      setDocuments(result.data?.data || []);
      setPagination(result.data?.pagination || { totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los documentos');
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    goToPage(1);
  }, [typeFilter]);

  const columns = [
    {
      key: 'fileName',
      label: 'Nombre',
      render: (val, row) => (
        <div className={styles.fileNameCell}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.fileIcon}>
            <path d="M4 1h5l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div className={styles.fileNameStack}>
            <span>{val || row.originalName || 'Documento'}</span>
            {row.documentType === 'invoice_pdf' && row.invoiceNumber && (
              <span className={styles.invoiceNumberHint}>
                N° {row.invoiceNumber}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'documentType',
      label: 'Tipo',
      render: (val) => (
        <span className={styles.typeLabel}>
          {TYPE_LABELS[val] || val || '—'}
        </span>
      ),
    },
    {
      key: 'relatedEntity',
      label: 'Entidad',
      render: (_, row) => {
        if (row.quote?.quoteNumber) return `Cotización ${row.quote.quoteNumber}`;
        if (row.project?.projectNumber) return `Proyecto ${row.project.projectNumber}`;
        if (row.quoteNumber) return `Cotización ${row.quoteNumber}`;
        if (row.projectNumber) return `Proyecto ${row.projectNumber}`;
        return '—';
      },
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    {
      key: 'sizeInBytes',
      label: 'Tamaño',
      render: (val) => formatFileSize(val),
    },
    {
      key: 'download',
      label: '',
      render: (_, row) => <PortalDocumentDownloadButton document={row} />,
    },
  ];

  if (error) {
    return (
      <div className={styles.page}>
        <PageHeader title="Mis Documentos" />
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={fetchDocuments}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Mis Documentos" />

      <div className={styles.filters}>
        <Select
          name="typeFilter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={TYPE_OPTIONS}
          placeholder="Filtrar por tipo"
        />
      </div>

      <div className={styles.tableWrap}>
        <Table
          columns={columns}
          data={documents}
          loading={loading}
          emptyMessage="No se encontraron documentos."
        />
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className={styles.paginationWrap}>
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
