'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { HeritageItem } from '@/lib/heritage-data'

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom Icon for Heritage Items
const heritageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom Icon for User
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function MapEffect({
  center,
  zoom
}: {
  center?: [number, number]
  zoom?: number
}) {
  const map = useMap()
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true })
    }
  }, [center, zoom, map])
  return null
}

export type HeritageMapProps = {
  heritageItems: HeritageItem[]
  userLocation: [number, number] | null
  selectedItem: HeritageItem | null
  onSelectItem: (item: HeritageItem) => void
  centerMapTo?: { center: [number, number]; zoom: number } | null
}

export default function HeritageMap({
  heritageItems,
  userLocation,
  selectedItem,
  onSelectItem,
  centerMapTo
}: HeritageMapProps) {
  // Center of India as default
  const defaultCenter: [number, number] = [20.5937, 78.9629]
  const defaultZoom = 5

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={defaultZoom} 
      className="h-full w-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      
      {centerMapTo && (
        <MapEffect center={centerMapTo.center} zoom={centerMapTo.zoom} />
      )}

      {userLocation && (
        <Marker position={userLocation} icon={userIcon} />
      )}

      {heritageItems.map((item) => (
        <Marker
          key={item.id}
          position={item.coordinates}
          icon={heritageIcon}
          eventHandlers={{
            click: () => onSelectItem(item)
          }}
        />
      ))}
    </MapContainer>
  )
}
