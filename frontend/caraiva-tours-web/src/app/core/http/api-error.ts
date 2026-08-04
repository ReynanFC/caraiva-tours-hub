export interface StandardError {
  timestamp: string;
  message: string;
  path: string;
  traceId: string;
}

export interface ValidationError {
  timestamp: string;
  errors: Record<string, string>;
  path: string;
  traceId: string;
}

export interface RateLimitError {
  timestamp: string;
  message: string;
  path: string;
  traceId: string;
  retryAfterSeconds: number;
}
