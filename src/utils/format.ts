export function formatCOP(value: number): string {
  return `$ ${value.toLocaleString('es-CO')} COP`;
}

export function formatCapacity(capacity: number): string {
  return capacity === 1 ? '1 persona' : `${capacity} personas`;
}
