import { supabase } from './supabase';

// Centralized caching service for API responses
class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.defaultTTL = 6 * 60 * 60 * 1000; // 6 hours
    this.maxMemoryCacheSize = 100; // Maximum items in memory cache
  }

  // Generate cache key
  generateKey(service, method, params) {
    const paramString = typeof params === 'object' ? JSON.stringify(params) : String(params);
    return `${service}_${method}_${paramString}`;
  }

  // Get from memory cache first, then database
  async get(service, method, params) {
    const key = this.generateKey(service, method, params);
    
    // Check memory cache first
    const memoryResult = this.getFromMemory(key);
    if (memoryResult) {
      return memoryResult;
    }

    // Check database cache
    const dbResult = await this.getFromDatabase(key);
    if (dbResult) {
      // Store in memory for faster access
      this.setInMemory(key, dbResult, this.defaultTTL);
      return dbResult;
    }

    return null;
  }

  // Set cache in both memory and database
  async set(service, method, params, data, ttl = this.defaultTTL) {
    const key = this.generateKey(service, method, params);
    
    // Defensive check at the entry point as well
    if (data === null || data === undefined) {
      console.warn(`Attempted to cache null/undefined data for ${service}.${method}. Skipping cache storage.`);
      return;
    }
    
    // Set in memory cache
    this.setInMemory(key, data, ttl);
    
    // Set in database cache
    await this.setInDatabase(key, data, ttl);
  }

  // Memory cache operations
  getFromMemory(key) {
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    
    if (cached) {
      this.memoryCache.delete(key);
    }
    
    return null;
  }

  setInMemory(key, data, ttl) {
    // Implement LRU eviction if cache is full
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + ttl,
      timestamp: Date.now()
    });
  }

  // Database cache operations
  async getFromDatabase(key) {
    try {
      const { data, error } = await supabase
        .from('api_cache')
        .select('data, expires_at')
        .eq('cache_key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No data found
        }
        console.error('Unexpected database cache error:', error);
        return null;
      }

      if (new Date() > new Date(data.expires_at)) {
        // Cache expired, delete it
        await this.deleteFromDatabase(key);
        return null;
      }

      return JSON.parse(data.data);
    } catch (error) {
      console.error('Database cache get error (unexpected):', error);
      return null;
    }
  }

  async setInDatabase(key, data, ttl) {
    try {
      // Defensive check to prevent null/undefined data from being stored
      if (data === null || data === undefined) {
        console.warn(`Attempted to cache null/undefined data for key: ${key}. Skipping cache storage.`);
        return;
      }

      const expiresAt = new Date(Date.now() + ttl).toISOString();
      
      await supabase
        .from('api_cache')
        .upsert({
          cache_key: key,
          data: JSON.stringify(data),
          created_at: new Date().toISOString(),
          expires_at: expiresAt
        });
    } catch (error) {
      console.error('Database cache set error:', error);
    }
  }

  async deleteFromDatabase(key) {
    try {
      await supabase
        .from('api_cache')
        .delete()
        .eq('cache_key', key);
    } catch (error) {
      console.error('Database cache delete error:', error);
    }
  }

  // Cache invalidation
  async invalidate(service, method, params) {
    const key = this.generateKey(service, method, params);
    
    // Remove from memory
    this.memoryCache.delete(key);
    
    // Remove from database
    await this.deleteFromDatabase(key);
  }

  async invalidatePattern(pattern) {
    // Invalidate memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Invalidate database cache
    try {
      await supabase
        .from('api_cache')
        .delete()
        .like('cache_key', `%${pattern}%`);
    } catch (error) {
      console.error('Pattern invalidation error:', error);
    }
  }

  // Cache statistics
  getMemoryCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.memoryCache.entries()) {
      if (now < value.expiry) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      total: this.memoryCache.size,
      valid: validEntries,
      expired: expiredEntries,
      hitRate: this.calculateHitRate()
    };
  }

  async getDatabaseCacheStats() {
    try {
      const { data, error } = await supabase
        .from('api_cache')
        .select('cache_key, expires_at');

      if (error) throw error;

      const now = new Date();
      const valid = data.filter(item => new Date(item.expires_at) > now).length;
      const expired = data.filter(item => new Date(item.expires_at) <= now).length;

      return {
        total: data.length,
        valid,
        expired
      };
    } catch (error) {
      console.error('Database cache stats error:', error);
      return { total: 0, valid: 0, expired: 0 };
    }
  }

  calculateHitRate() {
    // This would need to be implemented with hit/miss tracking
    return 0; // Placeholder
  }

  // Cleanup expired entries
  cleanupMemoryCache() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now >= value.expiry) {
        this.memoryCache.delete(key);
      }
    }
  }

  async cleanupDatabaseCache() {
    try {
      await supabase
        .from('api_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Database cleanup error:', error);
    }
  }

  // Preload common data
  async preloadUserData(githubUsername, leetcodeUsername) {
    const preloadTasks = [
      // GitHub data
      { service: 'github', method: 'profile', params: githubUsername },
      { service: 'github', method: 'repositories', params: githubUsername },
      { service: 'github', method: 'languages', params: githubUsername },
      
      // LeetCode data
      { service: 'leetcode', method: 'profile', params: leetcodeUsername },
      { service: 'leetcode', method: 'contests', params: leetcodeUsername },
      { service: 'leetcode', method: 'problems', params: leetcodeUsername }
    ];

    // Check which data is already cached
    const uncachedTasks = [];
    for (const task of preloadTasks) {
      const cached = await this.get(task.service, task.method, task.params);
      if (!cached) {
        uncachedTasks.push(task);
      }
    }

    return uncachedTasks;
  }

  // Clear all caches
  async clearAll() {
    // Clear memory cache
    this.memoryCache.clear();
    
    // Clear database cache
    try {
      await supabase
        .from('api_cache')
        .delete()
        .neq('cache_key', ''); // Delete all entries
    } catch (error) {
      console.error('Clear all cache error:', error);
    }
  }

  // Export cache data for debugging
  exportMemoryCache() {
    const cacheData = {};
    for (const [key, value] of this.memoryCache.entries()) {
      cacheData[key] = {
        data: value.data,
        expiry: new Date(value.expiry).toISOString(),
        timestamp: new Date(value.timestamp).toISOString()
      };
    }
    return cacheData;
  }
}

export const cacheService = new CacheService();
export default cacheService;