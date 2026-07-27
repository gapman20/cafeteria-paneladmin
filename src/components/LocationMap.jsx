import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSite } from '../context/SiteContext';

// Custom marker matching the grey/white dot style from the reference image
const customIcon = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #607D8B; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
           <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 50%;"></div>
         </div>`,
  className: 'custom-map-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

/**
 * Syncs the map view when center/zoom props change.
 */
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LocationMap = ({ center = [19.4326, -99.1332], zoom = 15, height = '400px' }) => {
  const { content } = useSite();
  return (
    <div className="map-wrapper" style={{ 
      height, 
      width: '100%', 
      borderRadius: '12px', 
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={zoom} />
        {/* Google Maps Standard TileLayer to match the requested image */}
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <Marker position={center} icon={customIcon}>
          <Popup className="premium-popup">
            <strong style={{ color: '#333', fontSize: '1.05rem', fontWeight: 'bold' }}>{content.siteName}</strong> <br />
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              {[content.contact?.address, content.contact?.city, content.contact?.state, content.contact?.postalCode, content.contact?.country].filter(Boolean).join(', ')}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;
