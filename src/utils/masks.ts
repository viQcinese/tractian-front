export function maskTemperature(value: number) {
  return `${value}°C`;
}

export function maskPercentage(value: number) {
  return `${value}%`;
}

export function maskPower(value: number) {
  return `${value} kWh`;
}

export function maskHours(value: number) {
  return `${value.toFixed(0)} h`;
}

export function maskDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
