import { formatDate, formatDateTime } from '../../core/utils/formatDate';

export default function DateText({ date, showTime = false }) {
  const formatted = showTime ? formatDateTime(date) : formatDate(date);
  return <span>{formatted}</span>;
}
