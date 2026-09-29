'use client'

import { useState, useEffect } from 'react'

export type LocationState = {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
  permissionState: PermissionState | 'unknown'
}

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    permissionState: 'unknown'
  })

  // Check permission on mount if supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocation((prev) => ({ ...prev, permissionState: result.state }))
        result.onchange = () => {
          setLocation((prev) => ({ ...prev, permissionState: result.state }))
        }
      }).catch(() => {
        setLocation((prev) => ({ ...prev, permissionState: 'unknown' }))
      })
    }
  }, [])

  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocation((prev) => ({ ...prev, error: "Your browser doesn't provide location access.", loading: false }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        }))
      },
      (error) => {
        let errorMsg = 'Location access is unavailable. You can still explore heritage across India.'
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. You can still explore heritage across India.'
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.'
        }
        setLocation((prev) => ({ ...prev, error: errorMsg, loading: false }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return { ...location, requestLocation }
}
