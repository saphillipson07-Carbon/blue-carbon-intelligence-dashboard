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
};

export default function Badge({ value }) {
  const cls = BADGE_CLASS[value] || 'na';
  return <span className={`badge ${cls}`}>{value}</span>;
}
