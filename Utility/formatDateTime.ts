export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};