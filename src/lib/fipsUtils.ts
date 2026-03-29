export function padFips(fips: string | number): string {
  return String(fips).padStart(5, '0')
}
