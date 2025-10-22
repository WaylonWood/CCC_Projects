import React, { useState } from 'react';
import useNetworkStore from '../store/networkStore';
import { isValidIP, isValidDomain } from '../utils/api';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const { searchTarget, loading, recentSearches, selectRecentSearch } = useNetworkStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    if (!isValidIP(trimmedValue) && !isValidDomain(trimmedValue)) {
      alert('Please enter a valid IP address or domain name');
      return;
    }
    
    searchTarget(trimmedValue);
  };

  const handleRecentSearchClick = (search) => {
    setInputValue(search.target);
    selectRecentSearch(search);
  };

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="target" className="block text-sm font-medium text-neon-green mb-2 font-mono">
              {'>'} ENTER_TARGET_[IP_ADDRESS|DOMAIN_NAME]
            </label>
            <input
              type="text"
              id="target"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="8.8.8.8 OR google.com"
              className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-neon-blue placeholder-gray-500 font-mono focus:ring-2 focus:ring-neon-green focus:border-neon-green focus:bg-cyber-dark transition-all duration-200 shadow-inner"
              disabled={loading}
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-purple disabled:from-gray-600 disabled:to-gray-700 text-cyber-black disabled:text-gray-400 px-6 py-3 rounded-lg font-mono font-bold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-neon-green/25 border border-transparent hover:border-neon-green/50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  <span>[SCANNING...]</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>[EXECUTE]</span>
                </>
              )}
            </button>
          </div>
        </div>

        {recentSearches.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-neon-blue mb-2 font-mono">{'>'} RECENT_QUERIES:</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleRecentSearchClick(search)}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono bg-cyber-dark hover:bg-cyber-light text-gray-300 hover:text-neon-green border border-cyber-border hover:border-neon-green/50 transition-all duration-200"
                >
                  <span className="truncate max-w-32">{search.target}</span>
                  <span className="ml-2 text-gray-500">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 flex flex-wrap gap-4 font-mono">
          <span className="text-neon-orange">EXAMPLES:</span>
          <button
            type="button"
            onClick={() => setInputValue('8.8.8.8')}
            className="text-neon-blue hover:text-neon-green underline hover:no-underline transition-colors duration-200"
          >
            8.8.8.8
          </button>
          <button
            type="button"
            onClick={() => setInputValue('google.com')}
            className="text-neon-blue hover:text-neon-green underline hover:no-underline transition-colors duration-200"
          >
            google.com
          </button>
          <button
            type="button"
            onClick={() => setInputValue('github.com')}
            className="text-neon-blue hover:text-neon-green underline hover:no-underline transition-colors duration-200"
          >
            github.com
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;