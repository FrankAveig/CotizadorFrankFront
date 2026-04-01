import { useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import { getPortalDocumentDownloadUrl } from '../services/portal-documents.service';

export default function PortalDocumentDownloadButton({
  documentId,
  fileName,
  document: doc,
  children,
}) {
  const [loading, setLoading] = useState(false);

  const id = documentId ?? doc?.id ?? doc?._id;
  const name =
    children ??
    fileName ??
    doc?.fileName ??
    doc?.originalName ??
    'Descargar';

  const handleDownload = useCallback(async () => {
    if (loading || !id) return;
    setLoading(true);
    try {
      const response = await getPortalDocumentDownloadUrl(id);
      const payload = response.data?.data ?? response.data;
      const url = payload?.url ?? payload;
      if (url) window.open(url, '_blank', 'noopener');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [id, loading]);

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={loading}
      onClick={handleDownload}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      }
    >
      {name}
    </Button>
  );
}
