import axios from 'axios';

// Backend URL configuration
const BACKEND_URL = 'http://localhost:3001';

// Backend availability check
const checkBackendAvailable = async () => {
  try {
    await axios.get(`${BACKEND_URL}/health`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
};

// API Configuration
const API_CONFIG = {
  IPINFO_TOKEN: import.meta.env.VITE_IPINFO_TOKEN || 'YOUR_IPINFO_TOKEN',
  API_NINJAS_KEY: import.meta.env.VITE_API_NINJAS_KEY || 'YOUR_API_NINJAS_KEY',
  SHODAN_KEY: import.meta.env.VITE_SHODAN_KEY || 'YOUR_SHODAN_KEY',
};

// Create axios instances with base configurations
const ipinfoAPI = axios.create({
  baseURL: 'https://ipinfo.io',
  timeout: 10000,
});

const apiNinjasAPI = axios.create({
  baseURL: 'https://api.api-ninjas.com/v1',
  timeout: 10000,
  headers: {
    'X-Api-Key': API_CONFIG.API_NINJAS_KEY,
  },
});

const shodanAPI = axios.create({
  baseURL: 'https://api.shodan.io/shodan',
  timeout: 10000,
});

// Helper function to resolve domain to IP using a public API
const resolveDomainToIP = async (domain) => {
  try {
    // Use a simple DNS resolution service
    const response = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`);
    if (response.data.Answer && response.data.Answer.length > 0) {
      return response.data.Answer[0].data;
    }
  } catch (error) {
    console.log('DNS resolution failed:', error.message);
  }
  return null;
};

// IP address validation
export const isValidIP = (ip) => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

// Domain name validation
export const isValidDomain = (domain) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
};

// Get IP information from IPinfo API (with backend fallback)
export const getIPInfo = async (target) => {
  // Try backend first
  const backendAvailable = await checkBackendAvailable();
  
  if (backendAvailable) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/ipinfo/${target}`);
      return {
        ...response.data,
        originalTarget: target,
        resolvedIP: !isValidIP(target) ? response.data.ip : undefined,
      };
    } catch (error) {
      console.error('Backend IPinfo error:', error.message);
    }
  }
  
  // Fallback to direct API call
  try {
    let actualIP = target;
    let isDomain = false;
    
    if (!isValidIP(target)) {
      isDomain = true;
      const resolvedIP = await resolveDomainToIP(target);
      if (resolvedIP) {
        actualIP = resolvedIP;
      } else {
        actualIP = target;
      }
    }
    
    let endpoint = actualIP;
    if (API_CONFIG.IPINFO_TOKEN && API_CONFIG.IPINFO_TOKEN !== 'YOUR_IPINFO_TOKEN') {
      endpoint = `${actualIP}?token=${API_CONFIG.IPINFO_TOKEN}`;
    }
    
    const response = await ipinfoAPI.get(`/${endpoint}`);
    const [lat, lng] = response.data.loc ? response.data.loc.split(',').map(Number) : [0, 0];
    
    return {
      ip: response.data.ip,
      city: response.data.city || 'Unknown',
      region: response.data.region || 'Unknown',
      country: response.data.country || 'Unknown',
      org: response.data.org || 'Unknown',
      postal: response.data.postal || 'Unknown',
      timezone: response.data.timezone || 'Unknown',
      coordinates: { lat, lng },
      success: true,
      originalTarget: target,
      resolvedIP: isDomain ? actualIP : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch IP information',
    };
  }
};

// Get ping information (with backend support for real data)
export const getPingInfo = async (target) => {
  // Try backend first for real ping data
  const backendAvailable = await checkBackendAvailable();
  
  if (backendAvailable) {
    try {
      console.log('Using backend ping data');
      const response = await axios.get(`${BACKEND_URL}/api/ping/${target}`);
      return response.data;
    } catch (error) {
      console.error('Backend ping error:', error.message);
    }
  }
  
  // Fallback to response time measurement
  try {
    const startTime = performance.now();
    
    let testURL = target;
    if (!isValidIP(target)) {
      const resolvedIP = await resolveDomainToIP(target);
      testURL = resolvedIP || target;
    }
    
    const response = await axios.get(`https://ipinfo.io/${testURL}/json`, {
      timeout: 5000
    });
    
    const endTime = performance.now();
    const pingTime = Math.round(endTime - startTime);
    
    return {
      hostname: target,
      ip: response.data.ip || testURL,
      pingTime: pingTime,
      status: 'up',
      success: true,
      isRealData: true,
      dataSource: 'Response Time Measurement',
    };
  } catch (error) {
    return {
      hostname: target,
      ip: target,
      pingTime: null,
      status: 'down',
      success: false,
      isRealData: true,
      dataSource: 'Failed Connection',
      note: 'Unable to connect to target',
    };
  }
};

// Get threat information (with backend support for real Shodan data)
export const getThreatInfo = async (ip) => {
  // Try backend first for real Shodan data
  const backendAvailable = await checkBackendAvailable();
  
  if (backendAvailable) {
    try {
      let targetIP = ip;
      if (!isValidIP(ip)) {
        const resolvedIP = await resolveDomainToIP(ip);
        targetIP = resolvedIP || ip;
      }
      
      console.log('Using backend Shodan data');
      const response = await axios.get(`${BACKEND_URL}/api/shodan/${targetIP}`);
      return response.data;
    } catch (error) {
      console.error('Backend Shodan error:', error.message);
    }
  }
  
  // Fallback - return error instead of demo data
  return {
    success: false,
    error: 'Security analysis unavailable - no valid API access',
    isRealData: false,
  };
};

// Generate mock latency data for chart
export const generateLatencyData = (baseLatency = 50) => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const variance = Math.random() * 20 - 10; // ±10ms variance
    const latency = Math.max(1, baseLatency + variance);
    
    data.push({
      time: timestamp.getHours() + ':00',
      latency: Math.round(latency),
      timestamp: timestamp.toISOString(),
    });
  }
  
  return data;
};

// Save search history
export const saveRecentSearch = (target, data) => {
  try {
    const searches = getRecentSearches();
    const newSearch = {
      target,
      timestamp: new Date().toISOString(),
      data,
    };
    
    // Keep most recent 10 searches
    searches.unshift(newSearch);
    const limitedSearches = searches.slice(0, 10);
    
    localStorage.setItem('networkMonitorSearches', JSON.stringify(limitedSearches));
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

// Load search history
export const getRecentSearches = () => {
  try {
    const searches = localStorage.getItem('networkMonitorSearches');
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};