/**
 * Centralized error handler to prevent exposing technical errors to users
 * Logs errors in development but shows user-friendly messages in production
 */

const isDevelopment = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;

/**
 * Safely log errors without exposing them to users
 * @param error - The error to log
 * @param context - Optional context about where the error occurred
 */
export function logError(error: unknown, context?: string): void {
  // Only log in development mode
  if (isDevelopment) {
    if (context) {
      // eslint-disable-next-line no-console
      console.error(`[${context}]`, error);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  // In production, errors are silently logged (could be sent to monitoring service)
}

/**
 * Get a user-friendly error message
 * @param error - The error object
 * @param fallbackMessage - Default message if error doesn't have a message
 */
export function getUserFriendlyError(error: unknown, fallbackMessage: string = "Something went wrong. Please try again."): string {
  if (error instanceof Error) {
    // If the error message is already user-friendly (doesn't contain technical terms)
    const technicalTerms = ['API', 'fetch', 'network', 'undefined', 'null', 'TypeError', 'ReferenceError', 'stack', 'at '];
    const hasTechnicalTerms = technicalTerms.some(term => error.message.includes(term));
    
    if (!hasTechnicalTerms && error.message.length < 200) {
      return error.message;
    }
  }
  return fallbackMessage;
}

/**
 * Handle errors with logging and user-friendly message
 * @param error - The error to handle
 * @param context - Context about where the error occurred
 * @param fallbackMessage - User-friendly message to show
 */
export function handleError(error: unknown, context?: string, fallbackMessage?: string): string {
  logError(error, context);
  return getUserFriendlyError(error, fallbackMessage);
}
