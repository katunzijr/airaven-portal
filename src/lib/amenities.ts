import type { Component } from 'vue'
import { t, type MessageKey } from '@/lib/i18n'
import type { AppLocale } from '@/lib/preferences'
import type { PropertyType } from '@/types'
import { getPropertyTypeConfig } from '@/lib/propertyTypes'
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
  Presentation,
  Volume2,
  ChefHat,
  Users,
  Bell,
  Shield,
  SquarePen,
  Umbrella,
  Mic2,
  Zap,
  Droplets,
  Fence,
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
  { id: 'beach_access', label: 'Beach access', icon: Umbrella },
  { id: 'projector', label: 'Projector', icon: Presentation },
  { id: 'sound_system', label: 'Sound system', icon: Volume2 },
  { id: 'catering', label: 'Catering kitchen', icon: ChefHat },
  { id: 'stage', label: 'Stage', icon: Mic2 },
  { id: 'meeting_room', label: 'Meeting room', icon: Users },
  { id: 'reception', label: 'Reception', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'whiteboard', label: 'Whiteboard', icon: SquarePen },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'water_supply', label: 'Water supply', icon: Droplets },
  { id: 'fenced', label: 'Fenced', icon: Fence },
]

export function getAmenitiesForPropertyType(type: PropertyType): AmenityOption[] {
  const allowed = new Set(getPropertyTypeConfig(type).amenityIds)
  return AMENITY_OPTIONS.filter((option) => allowed.has(option.id))
}

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
