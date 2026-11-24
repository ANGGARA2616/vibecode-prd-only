import { Property, Room, RoomType } from '../types/room';

export const STANDARD_FACILITIES: string[] = [
  'AC',
  'Kamar Mandi Dalam',
  'Wifi',
  'Lemari',
  'Kasur',
  'Meja Belajar',
  'TV',
  'Dapur',
];

export const ROOM_TYPES: { value: RoomType; label: string; badgeColor: string }[] = [
  { value: 'STANDARD', label: 'Standard', badgeColor: 'bg-slate-100 text-slate-700' },
  { value: 'DELUXE', label: 'Deluxe', badgeColor: 'bg-blue-100 text-blue-700' },
  { value: 'VIP', label: 'VIP', badgeColor: 'bg-purple-100 text-purple-700' },
  { value: 'EXCLUSIVE', label: 'Exclusive', badgeColor: 'bg-amber-100 text-amber-800' },
];

export const DEFAULT_PROPERTY: Property = {
  id: 'prop-amartha-01',
  name: 'Kost Griya Amartha',
  address: 'Jl. Sigura-gura No. 24, Lowokwaru, Malang',
  totalRooms: 4,
  occupiedRooms: 2,
  vacantRooms: 2,
};

export const INITIAL_MOCK_ROOMS: Room[] = [
  {
    id: 'room-101',
    propertyId: 'prop-amartha-01',
    ownerId: 'owner-anggara-01',
    roomNumber: '101',
    floor: 1,
    type: 'STANDARD',
    priceMonthly: 1500000,
    facilities: ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur'],
    status: 'OCCUPIED',
    tenantName: 'Dimas Arya',
    notes: 'Kamar lantai 1 dekat lobi utama',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'room-102',
    propertyId: 'prop-amartha-01',
    ownerId: 'owner-anggara-01',
    roomNumber: '102',
    floor: 1,
    type: 'STANDARD',
    priceMonthly: 1500000,
    facilities: ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur'],
    status: 'OCCUPIED',
    tenantName: 'Siti Rahma',
    notes: 'Kamar lantai 1 ventilasi samping',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'room-103',
    propertyId: 'prop-amartha-01',
    ownerId: 'owner-anggara-01',
    roomNumber: '103',
    floor: 1,
    type: 'STANDARD',
    priceMonthly: 1500000,
    facilities: ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur'],
    status: 'VACANT',
    notes: 'Kamar kosong siap huni',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'room-104',
    propertyId: 'prop-amartha-01',
    ownerId: 'owner-anggara-01',
    roomNumber: '104',
    floor: 1,
    type: 'DELUXE',
    priceMonthly: 1850000,
    facilities: ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur', 'Lemari', 'Meja Belajar'],
    status: 'VACANT',
    notes: 'Kamar deluxe sudut lantai 1',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
];
