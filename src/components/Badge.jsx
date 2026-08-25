import { useApp } from '../AppContext';

const BADGE_CLASS = {
  Implemented: 'good',
  'In Development': 'dev',
  Planned: 'plan',
  'Not Available': 'na',
  'No Data': 'na',
  Active: 'good',
  Operational: 'good',
  'Hard blocker': 'bad',
  'Soft blocker': 'plan',
  Host: 'dev',
  'Potential ITMO Supplier': 'good',
  'Potential Buyer': 'plan',
  Both: 'role',
  'In Progress': 'dev',
  Approved: 'good',
  'In Review': 'dev',
  Emerging: 'plan',
};

export default function Badge({ value }) {
  const { t } = useApp();
  const cls = BADGE_CLASS[value] || 'na';
  const label = BADGE_CLASS[value] ? t(`status.${value}`) : value;
  return <span className={`badge ${cls}`}>{label}</span>;
}
