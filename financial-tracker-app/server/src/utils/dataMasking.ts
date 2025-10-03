/**
 * Data Masking Utility for Sensitive Information
 * Prevents sensitive data from appearing in audit logs, error messages, etc.
 */

// Fields that should NEVER appear in logs or history
const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'privateKey',
  'creditCard',
  'cvv',
  'ssn',
  'socialSecurityNumber',
  'plaidAccessToken',
  'encryptionKey',
];

// Patterns to detect sensitive data
const SENSITIVE_PATTERNS = {
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

/**
 * Mask sensitive string values
 */
export function maskString(value: string, showLast: number = 4): string {
  if (!value || value.length <= showLast) {
    return '***';
  }
  const maskedLength = Math.max(3, value.length - showLast);
  return '*'.repeat(maskedLength) + value.slice(-showLast);
}

/**
 * Mask credit card number
 */
export function maskCreditCard(cardNumber: string): string {
  if (!cardNumber) return '***';
  const cleaned = cardNumber.replace(/\s|-/g, '');
  if (cleaned.length < 4) return '***';
  return `****-****-****-${cleaned.slice(-4)}`;
}

/**
 * Mask SSN
 */
export function maskSSN(ssn: string): string {
  if (!ssn) return '***';
  const cleaned = ssn.replace(/-/g, '');
  if (cleaned.length !== 9) return '***';
  return `***-**-${cleaned.slice(-4)}`;
}

/**
 * Mask email address
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 2 
    ? localPart[0] + '***' + localPart[localPart.length - 1]
    : '***';
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask IP address (keep first octet for debugging)
 */
export function maskIPAddress(ip: string): string {
  if (!ip) return '***.***.***.***';
  const parts = ip.split('.');
  if (parts.length !== 4) return '***.***.***.***';
  return `${parts[0]}.***.***.***.***`;
}

/**
 * Recursively mask sensitive fields in an object
 */
export function maskSensitiveData(
  data: any,
  options: {
    maskEmails?: boolean;
    maskIPs?: boolean;
    customFields?: string[];
  } = {}
): any {
  if (!data) return data;

  const { maskEmails = false, maskIPs = false, customFields = [] } = options;
  const fieldsToMask = [...SENSITIVE_FIELDS, ...customFields];

  // Handle primitive types
  if (typeof data !== 'object') return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item, options));
  }

  // Handle objects
  const masked: any = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // Check if field should be masked
    if (fieldsToMask.some(field => lowerKey.includes(field.toLowerCase()))) {
      if (typeof value === 'string') {
        // Determine masking strategy based on field name
        if (lowerKey.includes('card') || lowerKey.includes('credit')) {
          masked[key] = maskCreditCard(value);
        } else if (lowerKey.includes('ssn') || lowerKey.includes('social')) {
          masked[key] = maskSSN(value);
        } else if (lowerKey.includes('email')) {
          masked[key] = maskEmail(value);
        } else {
          masked[key] = maskString(value);
        }
      } else {
        masked[key] = '***';
      }
      continue;
    }

    // Optional: mask email addresses in any field
    if (maskEmails && typeof value === 'string' && value.includes('@')) {
      masked[key] = maskEmail(value);
      continue;
    }

    // Optional: mask IP addresses
    if (maskIPs && typeof value === 'string' && lowerKey.includes('ip')) {
      masked[key] = maskIPAddress(value);
      continue;
    }

    // Recursively mask nested objects
    if (value && typeof value === 'object') {
      masked[key] = maskSensitiveData(value, options);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Mask sensitive patterns in text
 */
export function maskSensitivePatternsInText(text: string): string {
  if (!text) return text;

  let masked = text;

  // Mask credit cards
  masked = masked.replace(SENSITIVE_PATTERNS.creditCard, (match) => {
    const digits = match.replace(/[\s-]/g, '');
    return maskCreditCard(digits);
  });

  // Mask SSNs
  masked = masked.replace(SENSITIVE_PATTERNS.ssn, (match) => {
    return maskSSN(match);
  });

  return masked;
}

/**
 * Check if data contains sensitive information
 */
export function containsSensitiveData(data: any): boolean {
  if (!data) return false;

  if (typeof data === 'string') {
    return SENSITIVE_PATTERNS.creditCard.test(data) ||
           SENSITIVE_PATTERNS.ssn.test(data);
  }

  if (typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
        return true;
      }
      if (containsSensitiveData(value)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Sanitize data before logging or storing in history
 */
export function sanitizeForLogging(data: any): any {
  return maskSensitiveData(data, {
    maskEmails: false, // Keep emails for audit trail
    maskIPs: false,     // Keep IPs for security monitoring
  });
}

/**
 * Sanitize data for external API responses
 */
export function sanitizeForAPI(data: any): any {
  return maskSensitiveData(data, {
    maskEmails: true,
    maskIPs: true,
    customFields: ['userAgent'], // Hide user agents in API responses
  });
}

/**
 * Generate safe error message (no sensitive data)
 */
export function sanitizeErrorMessage(error: any): string {
  if (!error) return 'An error occurred';
  
  const message = error.message || error.toString();
  
  // Remove any sensitive patterns
  return maskSensitivePatternsInText(message);
}
