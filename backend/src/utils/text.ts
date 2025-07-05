export function sanitizeInput(input: string): string {
  return input.replace(/[%_]/g, '');
}
