import { Document } from 'mongoose';
import { sanitizeForLogging } from './dataMasking';

/**
 * Utility to track changes between two objects
 */
export interface ChangeTracker {
  changedFields: string[];
  previousData: any;
  newData: any;
}

/**
 * Compare two objects and return changed fields with their values
 */
export function trackChanges<T extends Document>(
  previousDoc: T | null,
  newDoc: Partial<T>,
  fieldsToTrack: string[]
): ChangeTracker {
  const changedFields: string[] = [];
  const previousData: any = {};
  const newData: any = {};

  fieldsToTrack.forEach((field) => {
    const previousValue = previousDoc ? (previousDoc as any)[field] : undefined;
    const newValue = (newDoc as any)[field];

    // Check if the value has changed
    if (JSON.stringify(previousValue) !== JSON.stringify(newValue)) {
      changedFields.push(field);
      previousData[field] = previousValue;
      newData[field] = newValue;
    }
  });

  // Sanitize sensitive data before returning
  const sanitizedPreviousData = Object.keys(previousData).length > 0 
    ? sanitizeForLogging(previousData) 
    : undefined;
  const sanitizedNewData = Object.keys(newData).length > 0 
    ? sanitizeForLogging(newData) 
    : undefined;

  return {
    changedFields,
    previousData: sanitizedPreviousData,
    newData: sanitizedNewData,
  };
}

/**
 * Extract request metadata for history tracking
 */
export interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export function extractRequestMetadata(req: any): RequestMetadata {
  return {
    ipAddress: req.ip || req.connection?.remoteAddress || undefined,
    userAgent: req.get('user-agent') || undefined,
  };
}

/**
 * Create a snapshot of document for history
 */
export function createDocumentSnapshot<T extends Document>(
  doc: T,
  fields: string[]
): Record<string, any> {
  const snapshot: Record<string, any> = {};
  
  fields.forEach((field) => {
    snapshot[field] = (doc as any)[field];
  });
  
  // Sanitize sensitive data in the snapshot
  return sanitizeForLogging(snapshot);
}
