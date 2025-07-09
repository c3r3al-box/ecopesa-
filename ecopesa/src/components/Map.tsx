'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Center {
  id: number
  name: string
  position: [number, number] // [latitude, longitude]
  address: string
  hours: string
}

interface MapProps {
  centers: Center[]
}

export default function Map({ centers }: MapProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  // Default position centered on Nairobi, Kenya
  const nairobiPosition: [number, number] = [-1.286389, 36.817223]
  
  return (
    <MapContainer 
      center={nairobiPosition} 
      zoom={12} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {centers.map(center => (
        <Marker key={center.id} position={center.position}>
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold">{center.name}</h3>
              <p>{center.address}</p>
              <p className="text-gray-600">{center.hours}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}