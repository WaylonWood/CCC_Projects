import { create } from 'zustand';
import { getIPInfo, getPingInfo, getThreatInfo, generateLatencyData, saveRecentSearch } from '../utils/api';

const useNetworkStore = create((set, get) => ({
  // State
  currentTarget: '',
  loading: false,
  error: null,
  ipInfo: null,
  pingInfo: null,
  threatInfo: null,
  latencyData: [],
  recentSearches: JSON.parse(localStorage.getItem('networkMonitorSearches') || '[]'),
  autoRefresh: false,
  refreshInterval: null,

  // Actions
  setCurrentTarget: (target) => set({ currentTarget: target }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearData: () => set({
    ipInfo: null,
    pingInfo: null,
    threatInfo: null,
    latencyData: [],
    error: null,
  }),

  searchTarget: async (target) => {
    const { setLoading, setError, clearData } = get();
    
    if (!target.trim()) {
      setError('Please enter an IP address or domain name');
      return;
    }

    setLoading(true);
    setError(null);
    clearData();

    try {
      // Fetch all data in parallel
      const [ipResult, pingResult, threatResult] = await Promise.allSettled([
        getIPInfo(target),
        getPingInfo(target),
        getThreatInfo(target),
      ]);

      const ipInfo = ipResult.status === 'fulfilled' ? ipResult.value : null;
      const pingInfo = pingResult.status === 'fulfilled' ? pingResult.value : null;
      const threatInfo = threatResult.status === 'fulfilled' ? threatResult.value : null;

      // Generate latency data based on ping
      const baseLatency = pingInfo?.pingTime || 50;
      const latencyData = generateLatencyData(baseLatency);

      // Store results
      set({
        currentTarget: target,
        ipInfo,
        pingInfo,
        threatInfo,
        latencyData,
        loading: false,
      });

      // Save to history
      saveRecentSearch(target, { ipInfo, pingInfo, threatInfo });
      
      // Refresh search history
      const updatedSearches = JSON.parse(localStorage.getItem('networkMonitorSearches') || '[]');
      set({ recentSearches: updatedSearches });

    } catch (error) {
      console.error('Search error:', error);
      set({
        error: 'An unexpected error occurred while fetching data',
        loading: false,
      });
    }
  },

  refreshData: async () => {
    const { currentTarget, searchTarget } = get();
    if (currentTarget) {
      await searchTarget(currentTarget);
    }
  },

  toggleAutoRefresh: () => {
    const { autoRefresh, refreshInterval, refreshData } = get();
    
    if (autoRefresh) {
      // Turn off auto refresh
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      set({ autoRefresh: false, refreshInterval: null });
    } else {
      // Enable auto refresh (60s intervals)
      const interval = setInterval(() => {
        refreshData();
      }, 60000);
      
      set({ autoRefresh: true, refreshInterval: interval });
    }
  },

  selectRecentSearch: (search) => {
    set({
      currentTarget: search.target,
      ipInfo: search.data.ipInfo,
      pingInfo: search.data.pingInfo,
      threatInfo: search.data.threatInfo,
      latencyData: generateLatencyData(search.data.pingInfo?.pingTime || 50),
    });
  },

  clearRecentSearches: () => {
    localStorage.removeItem('networkMonitorSearches');
    set({ recentSearches: [] });
  },
}));

export default useNetworkStore;