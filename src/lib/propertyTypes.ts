import type { Component } from 'vue'
import type { PropertyType } from '@/types'
import { Home, Building2, DoorOpen, Castle, Trees, Fence } from 'lucide-vue-next'

export interface PropertyTypeOption {
  id: PropertyType
  label: string
  icon: Component
}

export const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = [
  { id: 'house', label: 'House', icon: Home },
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'room', label: 'Room', icon: DoorOpen },
  { id: 'villa', label: 'Villa', icon: Castle },
  { id: 'cabin', label: 'Cabin', icon: Trees },
  { id: 'cottage', label: 'Cottage', icon: Fence },
]
