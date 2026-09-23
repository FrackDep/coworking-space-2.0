export function formatCOP(value: number): string {
  return `$ ${value.toLocaleString('es-CO')} COP`;
}

export function formatCapacity(capacity: number): string {
  return capacity === 1 ? '1 persona' : `${capacity} personas`;
}

export function formatHours(hours: number): string {
  return hours === 1 ? '1 hora' : `${hours} horas`;
}

export function formatClockTime(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
