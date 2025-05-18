export function capitalize(input?: string): string | undefined {
  if (!input) return undefined
  return input.charAt(0).toUpperCase() + input.slice(1)
}
