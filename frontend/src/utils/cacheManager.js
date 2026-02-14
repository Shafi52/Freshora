// LocalStorage Cache Management Utility
// Products are cached permanently until manually cleared

const CACHE_KEYS = {
    PRODUCTS: "freshora_products",
    CART: "freshora_cart",
    USER: "freshora_user",
};

/**
 * Save products to localStorage
 * @param {Array} products - Array of product objects
 */
export const saveProductsToCache = (products) => {
    try {
        localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(products));
        console.log("💾 Saved", products.length, "products to localStorage");
        return true;
    } catch (error) {
        console.error("Error saving products to cache:", error);
        return false;
    }
};

/**
 * Get products from localStorage
 * @returns {Array|null} - Array of products or null if not found
 */
export const getProductsFromCache = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.PRODUCTS);
        if (cached) {
            const products = JSON.parse(cached);
            console.log("✅ Loaded", products.length, "products from localStorage");
            return products;
        }
        return null;
    } catch (error) {
        console.error("Error loading products from cache:", error);
        return null;
    }
};

/**
 * Clear products cache
 * ONLY call this when user explicitly requests to clear cache
 */
export const clearProductsCache = () => {
    try {
        localStorage.removeItem(CACHE_KEYS.PRODUCTS);
        console.log("🗑️ Cleared products cache");
        return true;
    } catch (error) {
        console.error("Error clearing products cache:", error);
        return false;
    }
};

/**
 * Clear ALL cache (products, cart, user, etc.)
 * ONLY call this when user explicitly requests to clear all data
 */
export const clearAllCache = () => {
    try {
        Object.values(CACHE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
        console.log("🗑️ Cleared all cache");
        return true;
    } catch (error) {
        console.error("Error clearing all cache:", error);
        return false;
    }
};

/**
 * Get cache info (for debugging)
 */
export const getCacheInfo = () => {
    const products = getProductsFromCache();
    return {
        productsCount: products ? products.length : 0,
        hasCachedProducts: !!products,
        cacheSize: localStorage.getItem(CACHE_KEYS.PRODUCTS)?.length || 0,
    };
};

export default {
    saveProductsToCache,
    getProductsFromCache,
    clearProductsCache,
    clearAllCache,
    getCacheInfo,
};
