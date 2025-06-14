type ConstraintType = | 'unique' | 'notnull' | 'foreignkey' | 'check' | 'unknown';

type ConstraintError = {
  type: ConstraintType;
  message: string;
}

export function parseConstraint(error: unknown): ConstraintError | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) return null;

  let message = (error as any).message ?? '';

  if (message.includes('UNIQUE')) return { type: 'unique', message };
  if (message.includes('NOT NULL')) return { type: 'notnull', message };
  if (message.includes('FOREIGN KEY')) return { type: 'foreignkey', message };
  if (message.includes('CHECK')) return { type: 'check', message };

  return { type: 'unknown', message };
}
