import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import useNetworkStore from '../store/networkStore';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Create custom cyberpunk marker
const cyberpunkIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5S25 23.4 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#00ff41" stroke="#000" stroke-width="1"/>
      <circle cx="12.5" cy="12.5" r="6" fill="#0a0a0f" stroke="#00ff41" stroke-width="2"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="37" rx="18" ry="4" fill="#000" opacity="0.3"/>
    </svg>
  `),
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const MapCard = () => {
  const { ipInfo, loading, currentTarget } = useNetworkStore();

  if (loading) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">GEOGRAPHIC_LOCATION</h2>
        <div className="animate-pulse">
          <div className="h-64 bg-cyber-light rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!ipInfo || !ipInfo.coordinates || (ipInfo.coordinates.lat === 0 && ipInfo.coordinates.lng === 0)) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">GEOGRAPHIC_LOCATION</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-cyber-dark border border-cyber-border rounded-lg">
          <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-mono text-sm">LOCATION_DATA_NOT_AVAILABLE</p>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            {currentTarget ? 'UNABLE_TO_DETERMINE_GEOGRAPHIC_LOCATION' : 'SEARCH_FOR_IP_OR_DOMAIN_TO_SEE_LOCATION'}
          </p>
        </div>
      </div>
    );
  }

  const { lat, lng } = ipInfo.coordinates;
  const position = [lat, lng];

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neon-green font-mono">GEOGRAPHIC_LOCATION</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400 font-mono">
          <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{ipInfo.city}, {ipInfo.country}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-64 rounded-lg overflow-hidden border border-cyber-border shadow-inner">
          <MapContainer
            center={position}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="opacity-80"
            />
            <Marker position={position} icon={cyberpunkIcon}>
              <Popup className="cyberpunk-popup">
                <div className="text-sm bg-cyber-darker text-gray-300 p-2 rounded font-mono">
                  <div className="font-semibold text-neon-green">{currentTarget}</div>
                  <div className="text-gray-400">{ipInfo.city}, {ipInfo.region}</div>
                  <div className="text-gray-400">{ipInfo.country}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-400 font-mono">LATITUDE:</dt>
            <dd className="font-mono text-neon-blue">{lat.toFixed(6)}°</dd>
          </div>
          <div>
            <dt className="text-gray-400 font-mono">LONGITUDE:</dt>
            <dd className="font-mono text-neon-blue">{lng.toFixed(6)}°</dd>
          </div>
        </div>

        <div className="bg-cyber-dark border border-neon-blue/50 rounded-lg p-3 shadow-lg shadow-neon-blue/10">
          <div className="flex">
            <svg className="w-5 h-5 text-neon-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-neon-blue font-mono">LOCATION_INFO:</p>
              <p className="text-gray-400 mt-1 font-mono text-xs">
                APPROXIMATE_LOCATION_BASED_ON_IP_GEOLOCATION_DATA.
                ACTUAL_LOCATION_MAY_VARY_DEPENDING_ON_ISP_ROUTING.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapCard;