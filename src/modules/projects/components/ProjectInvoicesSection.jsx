import { useState, useRef } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import DownloadDocumentButton from '../../documents/components/DownloadDocumentButton';
import { uploadProjectInvoice } from '../services/projects.service';
import { formatDate } from '../../../core/utils/formatDate';
import styles from './ProjectInvoicesSection.module.css';

const MAX_BYTES = 15 * 1024 * 1024;

function formatUploader(uploadedBy) {
  if (!uploadedBy) return '—';
  if (typeof uploadedBy === 'string') return uploadedBy;
  return (
    uploadedBy.name ||
    uploadedBy.fullName ||
    uploadedBy.email ||
    '—'
  );
}

export default function ProjectInvoicesSection({
  projectId,
  invoices = [],
  loading = false,
  onRefresh,
  addNotification,
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFile(null);
    setInvoiceNumber('');
    setNotes('');
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeModal = () => {
    setUploadOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!file) {
      setFormError('Selecciona un archivo.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setFormError('El archivo supera los 15 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const num = invoiceNumber.trim();
    const note = notes.trim();
    if (num) formData.append('invoiceNumber', num.slice(0, 100));
    if (note) formData.append('notes', note.slice(0, 2000));

    try {
      setSubmitting(true);
      await uploadProjectInvoice(projectId, formData);
      addNotification?.('success', 'Factura subida correctamente.');
      closeModal();
      onRefresh?.();
    } catch (err) {
      const msg =
        err.response?.data?.message || 'No se pudo subir la factura.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setFormError('');
  };

  return (
    <>
      <Card
        title="Facturas emitidas"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setUploadOpen(true)}
          >
            Subir factura
          </Button>
        }
      >
        {loading ? (
          <div className={styles.loaderWrap}>
            <Loader size="md" />
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            title="Sin facturas"
            message="Aún no hay facturas cargadas para este proyecto. Usa «Subir factura» para agregar la primera."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>N° factura</th>
                  <th className={styles.th}>Archivo</th>
                  <th className={styles.th}>Notas</th>
                  <th className={styles.th}>Fecha</th>
                  <th className={styles.th}>Subido por</th>
                  <th className={styles.th}>Descargar</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((doc, idx) => {
                  const docId = doc._id || doc.id;
                  const fileName = doc.fileName || doc.name || '—';
                  return (
                    <tr key={docId || idx} className={styles.tr}>
                      <td className={styles.td}>
                        {doc.invoiceNumber || '—'}
                      </td>
                      <td className={styles.td}>{fileName}</td>
                      <td className={`${styles.td} ${styles.notes}`}>
                        {doc.notes || '—'}
                      </td>
                      <td className={styles.td}>
                        {formatDate(doc.createdAt)}
                      </td>
                      <td className={styles.td}>
                        {formatUploader(doc.uploadedBy)}
                      </td>
                      <td className={styles.td}>
                        {docId ? (
                          <DownloadDocumentButton
                            documentId={docId}
                            fileName={fileName}
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={uploadOpen}
        onClose={closeModal}
        title="Subir factura"
        size="md"
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.hint}>
            PDF o imagen (JPEG, PNG, WebP). Tamaño máximo 15 MB.
          </p>

          <div className={styles.fileField}>
            <label htmlFor="invoice-file" className={styles.fileLabel}>
              Archivo <span className={styles.req}>*</span>
            </label>
            <input
              ref={fileInputRef}
              id="invoice-file"
              name="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              className={styles.fileInput}
            />
            {file && (
              <span className={styles.fileName}>{file.name}</span>
            )}
          </div>

          <Input
            label="Número de factura (opcional)"
            name="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Ej. 001-001-000123456"
            maxLength={100}
          />

          <TextArea
            label="Notas (opcional)"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Período facturado"
            rows={3}
            maxLength={2000}
          />

          {formError && (
            <p className={styles.formError} role="alert">
              {formError}
            </p>
          )}

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Subir
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
