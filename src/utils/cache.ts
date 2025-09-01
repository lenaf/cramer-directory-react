// Simple in-memory cache for entities
const entityCache = new Map<string, any>();
const entityNameCache = new Map<string, string>();

// Cache full entity data
export const cacheEntity = (id: string, data: any) => {
  entityCache.set(id, { ...data, _cachedAt: Date.now() });
};

// Get cached entity data
export const getCachedEntity = (id: string): any | undefined => {
  const cached = entityCache.get(id);
  if (!cached) return undefined;
  
  // Cache expires after 5 minutes
  if (Date.now() - cached._cachedAt > 5 * 60 * 1000) {
    entityCache.delete(id);
    return undefined;
  }
  
  return cached;
};

// Cache entity names for navigation
export const cacheEntityName = (id: string, name: string) => {
  entityNameCache.set(id, name);
};

export const getCachedEntityName = (id: string): string | undefined => {
  return entityNameCache.get(id);
};

// Clear all caches
export const clearCache = () => {
  entityCache.clear();
  entityNameCache.clear();
};