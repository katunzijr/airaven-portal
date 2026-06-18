import type { Component } from 'vue'
import { t, type MessageKey } from '@/lib/i18n'
import type { AppLocale } from '@/lib/preferences'
import {
  Wifi,
  UtensilsCrossed,
  Waves,
  Wind,
  Car,
  Tv,
  Shirt,
  Flame,
  Dumbbell,
  PawPrint,
  Coffee,
} from 'lucide-vue-next'

export interface AmenityOption {
  id: string
  label: string
  icon: Component
}

export const AMENITY_OPTIONS: AmenityOption[] = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'ac', label: 'Air conditioning', icon: Wind },
  { id: 'parking', label: 'Free parking', icon: Car },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'washer', label: 'Washer', icon: Shirt },
  { id: 'heating', label: 'Heating', icon: Flame },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'pets', label: 'Pets allowed', icon: PawPrint },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
]

export function amenityLabels(ids: string[]): string[] {
  return ids.map((id) => AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id)
}

export function resolveAmenity(name: string): AmenityOption | undefined {
  const lower = name.trim().toLowerCase()
  return AMENITY_OPTIONS.find(
    (a) => a.id === lower || a.label.toLowerCase() === lower,
  )
}

export function amenityDisplayName(name: string, locale: AppLocale = 'en'): string {
  const option = resolveAmenity(name)
  if (!option) return name
  const key = `amenity.${option.id}` as MessageKey
  return t(key, locale)
}
