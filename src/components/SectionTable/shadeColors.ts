export function shadeScoreColor(score: number): string {
  if (score >= 8) return 'bg-green-100 text-green-800';
  if (score >= 5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function shadeScoreBarColor(score: number): string {
  if (score >= 8) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-400';
  return 'bg-red-500';
}

export function statusLabel(status: string): string {
  if (status === 'full-shade') return 'Full Shade';
  if (status === 'partial-shade') return 'Partial Sun';
  return 'Full Sun';
}

export function statusDot(status: string): string {
  if (status === 'full-shade') return 'bg-green-500';
  if (status === 'partial-shade') return 'bg-yellow-400';
  return 'bg-red-500';
}
