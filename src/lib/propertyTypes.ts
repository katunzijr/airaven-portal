import type { Component } from 'vue'
import type { PropertyType } from '@/types'
import {
  Home,
  Building2,
  DoorOpen,
  Warehouse,
  Triangle,
  Castle,
  Trees,
  Fence,
  Waves,
  Briefcase,
  LandPlot,
} from 'lucide-vue-next'

export interface PropertyTypeOption {
  id: PropertyType
  label: string
  icon: Component
}

export interface PropertyTypeConfig {
  id: PropertyType
  label: string
  icon: Component
  amenityIds: string[]
  allowsMultipleUnits: boolean
  defaultUnitName: string
  unitNamePlaceholder: string
  counterFields: ('maxGuests' | 'bedrooms' | 'beds' | 'bathrooms')[]
}

const RESIDENTIAL_AMENITIES = [
  'wifi',
  'kitchen',
  'pool',
  'ac',
  'parking',
  'tv',
  'washer',
  'heating',
  'gym',
  'pets',
  'breakfast',
  'beach_access',
]

const ROOM_AMENITIES = ['wifi', 'ac', 'tv', 'breakfast', 'parking', 'washer', 'gym', 'pets']

const HALL_AMENITIES = [
  'wifi',
  'parking',
  'ac',
  'kitchen',
  'tv',
  'catering',
  'projector',
  'sound_system',
  'stage',
]

const BUSINESS_AMENITIES = [
  'wifi',
  'parking',
  'ac',
  'projector',
  'whiteboard',
  'reception',
  'security',
  'kitchen',
  'meeting_room',
]

const PLOT_AMENITIES = [
  'wifi',
  'parking',
  'pets',
  'security',
  'heating',
  'beach_access',
  'electricity',
  'water_supply',
  'fenced',
]

const RESIDENTIAL_COUNTERS: PropertyTypeConfig['counterFields'] = [
  'maxGuests',
  'bedrooms',
  'beds',
  'bathrooms',
]

const CAPACITY_COUNTERS: PropertyTypeConfig['counterFields'] = ['maxGuests', 'bathrooms']

export const PROPERTY_TYPE_CONFIG: Record<PropertyType, PropertyTypeConfig> = {
  house: {
    id: 'house',
    label: 'House',
    icon: Home,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: true,
    defaultUnitName: 'House unit',
    unitNamePlaceholder: 'Main house',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  apartment: {
    id: 'apartment',
    label: 'Apartment',
    icon: Building2,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: true,
    defaultUnitName: 'Apartment unit',
    unitNamePlaceholder: '2BR apartment',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  room: {
    id: 'room',
    label: 'Rooms',
    icon: DoorOpen,
    amenityIds: ROOM_AMENITIES,
    allowsMultipleUnits: true,
    defaultUnitName: 'Standard Room',
    unitNamePlaceholder: 'Standard Room',
    counterFields: ['maxGuests', 'beds', 'bathrooms'],
  },
  hall: {
    id: 'hall',
    label: 'Hall',
    icon: Warehouse,
    amenityIds: HALL_AMENITIES,
    allowsMultipleUnits: true,
    defaultUnitName: 'Main Hall',
    unitNamePlaceholder: 'Main Hall',
    counterFields: CAPACITY_COUNTERS,
  },
  frame: {
    id: 'frame',
    label: 'A-Frame',
    icon: Triangle,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: false,
    defaultUnitName: 'Entire A-Frame',
    unitNamePlaceholder: 'Entire A-Frame',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  villa: {
    id: 'villa',
    label: 'Villa',
    icon: Castle,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: false,
    defaultUnitName: 'Entire villa',
    unitNamePlaceholder: 'Entire villa',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  cabin: {
    id: 'cabin',
    label: 'Cabin',
    icon: Trees,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: false,
    defaultUnitName: 'Entire cabin',
    unitNamePlaceholder: 'Entire cabin',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  cottage: {
    id: 'cottage',
    label: 'Cottage',
    icon: Fence,
    amenityIds: RESIDENTIAL_AMENITIES.filter((id) => id !== 'beach_access'),
    allowsMultipleUnits: false,
    defaultUnitName: 'Entire cottage',
    unitNamePlaceholder: 'Entire cottage',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  beachfront: {
    id: 'beachfront',
    label: 'Beachfront',
    icon: Waves,
    amenityIds: RESIDENTIAL_AMENITIES,
    allowsMultipleUnits: false,
    defaultUnitName: 'Entire beachfront stay',
    unitNamePlaceholder: 'Entire beachfront stay',
    counterFields: RESIDENTIAL_COUNTERS,
  },
  business: {
    id: 'business',
    label: 'Business space',
    icon: Briefcase,
    amenityIds: BUSINESS_AMENITIES,
    allowsMultipleUnits: true,
    defaultUnitName: 'Office space',
    unitNamePlaceholder: 'Office space',
    counterFields: CAPACITY_COUNTERS,
  },
  plot: {
    id: 'plot',
    label: 'Plot',
    icon: LandPlot,
    amenityIds: PLOT_AMENITIES,
    allowsMultipleUnits: true,
    defaultUnitName: 'Plot',
    unitNamePlaceholder: 'Camping plot A',
    counterFields: ['maxGuests', 'bathrooms'],
  },
}

export const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = Object.values(PROPERTY_TYPE_CONFIG).map(
  ({ id, label, icon }) => ({ id, label, icon }),
)

export function getPropertyTypeConfig(type: PropertyType): PropertyTypeConfig {
  return PROPERTY_TYPE_CONFIG[type]
}

export function propertyTypeAllowsMultipleUnits(type: PropertyType): boolean {
  return PROPERTY_TYPE_CONFIG[type].allowsMultipleUnits
}
