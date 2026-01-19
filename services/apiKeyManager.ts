/**
 * Secure API Key Manager
 *
 * Security notes:
 * - For production, API keys should be stored server-side
 * - Client-side storage (localStorage/sessionStorage) is vulnerable to XSS
 * - This implementation provides minimal improvements over direct localStorage
 * - Consider implementing a backend proxy for API calls in production
 */

const KEY_PREFIX = 'nova_secure_';
const OBSUCATED_PREFIX = '*****';

// Simple obfuscation (NOT encryption - just prevents casual reading)
// For real security, use proper encryption with a server-side component
const obfuscate = (value: string): string => {
  return btoa(encodeURIComponent(value));
};

const deobfuscate = (value: string): string => {
  try {
    return decodeURIComponent(atob(value));
  } catch {
    return '';
  }
};

/**
 * Storage interface abstraction
 */
interface SecureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Session-only storage (cleared when tab closes)
 * More secure than localStorage but still not production-ready
 */
class SessionStorageAdapter implements SecureStorage {
  async getItem(key: string): Promise<string | null> {
    return sessionStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }
}

/**
 * Local storage with obfuscation
 * Falls back to localStorage if session storage fails
 */
class LocalStorageAdapter implements SecureStorage {
  async getItem(key: string): Promise<string | null> {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return deobfuscate(item);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, obfuscate(value));
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

// Use session storage by default (more secure)
const storage: SecureStorage = new SessionStorageAdapter();

/**
 * Migration function to move keys from localStorage to session storage
 * Call this on app initialization if you want to migrate existing keys
 */
export async function migrateKeysToSessionStorage(): Promise<void> {
  const keys = ['pollo_api_key', 'openrouter_api_key'];

  for (const key of keys) {
    const localValue = localStorage.getItem(key);
    if (localValue) {
      await storage.setItem(`${KEY_PREFIX}${key}`, localValue);
      localStorage.removeItem(key);
      console.log(`Migrated ${key} to secure storage`);
    }
  }
}

/**
 * Get API key securely
 */
export async function getApiKey(
  provider: 'pollo' | 'openrouter' | 'google'
): Promise<string | null> {
  try {
    const key = await storage.getItem(`${KEY_PREFIX}${provider}_api_key`);
    return key;
  } catch (error) {
    console.error('Failed to get API key:', error);
    return null;
  }
}

/**
 * Set API key securely
 */
export async function setApiKey(
  provider: 'pollo' | 'openrouter' | 'google',
  key: string
): Promise<void> {
  try {
    if (!key || key.trim().length === 0) {
      await storage.removeItem(`${KEY_PREFIX}${provider}_api_key`);
    } else {
      await storage.setItem(`${KEY_PREFIX}${provider}_api_key`, key.trim());
    }
  } catch (error) {
    console.error('Failed to set API key:', error);
    throw new Error('Failed to store API key securely');
  }
}

/**
 * Check if API key exists (without exposing the value)
 */
export async function hasApiKey(
  provider: 'pollo' | 'openrouter' | 'google'
): Promise<boolean> {
  const key = await getApiKey(provider);
  return key !== null && key.length > 0;
}

/**
 * Clear all API keys
 */
export async function clearAllApiKeys(): Promise<void> {
  try {
    await storage.removeItem(`${KEY_PREFIX}pollo_api_key`);
    await storage.removeItem(`${KEY_PREFIX}openrouter_api_key`);
    await storage.removeItem(`${KEY_PREFIX}google_api_key`);
  } catch (error) {
    console.error('Failed to clear API keys:', error);
  }
}

/**
 * Get masked key preview for UI display
 */
export async function getKeyPreview(
  provider: 'pollo' | 'openrouter' | 'google'
): Promise<string> {
  const key = await getApiKey(provider);
  if (!key) return '';

  if (key.length <= 8) return OBSUCATED_PREFIX;

  return `${key.substring(0, 4)}${OBSUCATED_PREFIX}${key.substring(key.length - 4)}`;
}

/**
 * Legacy compatibility - check for keys in old localStorage format
 * This allows gradual migration from the old system
 */
export function getLegacyApiKey(
  provider: 'pollo' | 'openrouter'
): string | null {
  try {
    const key = localStorage.getItem(`${provider}_api_key`);
    return key;
  } catch {
    return null;
  }
}

/**
 * Security warning for development
 */
export function logSecurityWarning(): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️ Security Warning: API keys are currently stored in browser storage.\n' +
        'For production deployment, implement a server-side API proxy to handle credentials securely.\n' +
        'Never commit API keys to version control.'
    );
  }
}
