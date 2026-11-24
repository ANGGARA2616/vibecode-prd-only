import { MassGeneratorParams, Room, RoomDraft } from '../types/room';

export function calculateRoomRange(prefix: string, startNumber: number, count: number): string {
  if (count <= 0) return '-';
  const start = `${prefix}${startNumber}`;
  const end = `${prefix}${startNumber + count - 1}`;
  return count === 1 ? start : `${start} – ${end}`;
}

export function generateRoomDrafts(params: MassGeneratorParams): RoomDraft[] {
  const drafts: RoomDraft[] = [];
  const safeCount = Math.max(1, Math.min(50, params.count));

  for (let i = 0; i < safeCount; i++) {
    const currentNum = params.startNumber + i;
    const roomNumber = `${params.prefix}${currentNum}`;
    drafts.push({
      tempId: `draft-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      roomNumber,
      floor: params.floor,
      type: params.type,
      facilities: [...params.facilities],
      priceMonthly: params.priceMonthly,
    });
  }

  return drafts;
}

export interface ValidationResult {
  hasDuplicate: boolean;
  duplicateNumbers: string[];
  validatedDrafts: RoomDraft[];
}

export function validateDraftDuplicates(
  drafts: RoomDraft[],
  existingRooms: Room[]
): ValidationResult {
  const existingSet = new Set(existingRooms.map((r) => r.roomNumber.trim().toUpperCase()));
  const seenInBatch = new Map<string, number>();
  const duplicateNumbers: string[] = [];

  // Count occurrences within batch
  drafts.forEach((d) => {
    const cleanNum = d.roomNumber.trim().toUpperCase();
    seenInBatch.set(cleanNum, (seenInBatch.get(cleanNum) || 0) + 1);
  });

  const validatedDrafts = drafts.map((draft) => {
    const cleanNum = draft.roomNumber.trim().toUpperCase();
    const isCollisionWithExisting = existingSet.has(cleanNum);
    const isCollisionInBatch = (seenInBatch.get(cleanNum) || 0) > 1;

    if (isCollisionWithExisting) {
      if (!duplicateNumbers.includes(draft.roomNumber)) {
        duplicateNumbers.push(draft.roomNumber);
      }
      return {
        ...draft,
        isDuplicate: true,
        errorMessage: `Nomor kamar "${draft.roomNumber}" sudah dipakai di properti ini. Gunakan nomor lain.`,
      };
    } else if (isCollisionInBatch) {
      if (!duplicateNumbers.includes(draft.roomNumber)) {
        duplicateNumbers.push(draft.roomNumber);
      }
      return {
        ...draft,
        isDuplicate: true,
        errorMessage: `Nomor kamar "${draft.roomNumber}" kembar dalam daftar input ini.`,
      };
    }

    return {
      ...draft,
      isDuplicate: false,
      errorMessage: undefined,
    };
  });

  return {
    hasDuplicate: duplicateNumbers.length > 0,
    duplicateNumbers,
    validatedDrafts,
  };
}

export function autoCorrectDuplicates(
  drafts: RoomDraft[],
  existingRooms: Room[],
  prefixHint = ''
): RoomDraft[] {
  const existingSet = new Set(existingRooms.map((r) => r.roomNumber.trim().toUpperCase()));
  const usedNumbers = new Set(existingSet);

  return drafts.map((draft, idx) => {
    const cleanNum = draft.roomNumber.trim().toUpperCase();

    // If cleanNum is already used or duplicated, find next available sequence
    if (usedNumbers.has(cleanNum) || draft.isDuplicate) {
      // Parse prefix and number if possible
      const match = draft.roomNumber.match(/^([A-Za-z\-_\s]*)(\d+)$/);
      const prefix = match ? match[1] : prefixHint;
      let counter = match ? parseInt(match[2], 10) + 1 : idx + 1;

      let candidate = `${prefix}${counter}`;
      while (usedNumbers.has(candidate.trim().toUpperCase())) {
        counter++;
        candidate = `${prefix}${counter}`;
      }

      usedNumbers.add(candidate.trim().toUpperCase());
      return {
        ...draft,
        roomNumber: candidate,
        isDuplicate: false,
        errorMessage: undefined,
      };
    } else {
      usedNumbers.add(cleanNum);
      return {
        ...draft,
        isDuplicate: false,
        errorMessage: undefined,
      };
    }
  });
}
