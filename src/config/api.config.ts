// API Configuration
export const API_CONFIG = {
  // Event Service URL - for SuperAdmin direct connection
  EVENT_SERVICE_URL:
    import.meta.env.VITE_EVENT_SERVICE_URL || 'https://localhost:8080/event',

  // API Gateway URL - for general API calls
  API_GATEWAY_URL:
    import.meta.env.VITE_API_GATEWAY_URL || 'https://localhost:3000',

  // Default timeout for API requests
  DEFAULT_TIMEOUT: 10000,
} as const;

// Clerk Configuration
export const CLERK_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
} as const;
