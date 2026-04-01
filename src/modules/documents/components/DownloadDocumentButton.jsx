import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { getDocumentDownloadUrl } from '../services/documents.service';

export default function DownloadDocumentButton({ documentId, fileName }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const { data: res } = await getDocumentDownloadUrl(documentId);
      const url =
        res.data?.url ?? res.data?.data?.url ?? (typeof res.data === 'string' ? res.data : null);
      if (url) {
        window.open(url, '_blank');
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      loading={loading}
      title={`Descargar ${fileName || 'documento'}`}
    >
      Descargar
    </Button>
  );
}
