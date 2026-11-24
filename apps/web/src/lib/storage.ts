import { Property, Room } from '../types/room';
import { DEFAULT_PROPERTY, INITIAL_MOCK_ROOMS } from './constants';

const STORAGE_KEYS = {
  ROOMS: 'ngekost_rooms_v1',
  PROPERTY: 'ngekost_property_v1',
};

export function getStoredRooms(): Room[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_ROOMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_MOCK_ROOMS));
      return INITIAL_MOCK_ROOMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_ROOMS;
  }
}

export function saveStoredRooms(rooms: Room[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  } catch (e) {
    console.error('Failed to save rooms to localStorage', e);
  }
}

export function getStoredProperty(roomsCount?: number): Property {
  if (typeof window === 'undefined') return DEFAULT_PROPERTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTY);
    const prop: Property = raw ? JSON.parse(raw) : DEFAULT_PROPERTY;

    if (roomsCount !== undefined) {
      prop.totalRooms = roomsCount;
    }
    return prop;
  } catch {
    return DEFAULT_PROPERTY;
  }
}

export function resetToDefaultSeed(): Room[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_MOCK_ROOMS));
    localStorage.setItem(STORAGE_KEYS.PROPERTY, JSON.stringify(DEFAULT_PROPERTY));
  }
  return INITIAL_MOCK_ROOMS;
}

export function clearAllRooms(): Room[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify([]));
  }
  return [];
}
