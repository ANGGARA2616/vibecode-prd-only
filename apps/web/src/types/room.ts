export type RoomType = 'STANDARD' | 'DELUXE' | 'VIP' | 'EXCLUSIVE';

export type RoomStatus = 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface Room {
  id: string;
  propertyId: string;
  ownerId: string;
  roomNumber: string;
  floor?: number;
  type: RoomType;
  priceMonthly: number;
  facilities: string[];
  imageUrl?: string;
  status: RoomStatus;
  notes?: string;
  tenantName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
}

export interface MassGeneratorParams {
  type: RoomType;
  floor: number;
  facilities: string[];
  priceMonthly: number;
  count: number;
  prefix: string;
  startNumber: number;
}

export interface RoomDraft {
  tempId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  facilities: string[];
  priceMonthly: number;
  isDuplicate?: boolean;
  errorMessage?: string;
}

export interface DuplicateParams {
  sourceRoomId: string;
  count: number;
  prefix: string;
  customNumbers: string[];
}
