/** Backend base URL — trimmed to tolerate accidental whitespace in env vars. */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
