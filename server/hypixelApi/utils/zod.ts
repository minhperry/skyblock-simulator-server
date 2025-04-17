import {ZodError} from 'zod';

export function joinZodError(zErr: ZodError) {
  return zErr.issues.map(issue => issue.message).join('; ')
}