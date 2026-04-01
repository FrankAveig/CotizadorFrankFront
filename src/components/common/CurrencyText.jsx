import { formatCurrency } from '../../core/utils/formatCurrency';

export default function CurrencyText({ amount }) {
  return <span>{formatCurrency(amount)}</span>;
}
