'use client';

import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Room, RoomType } from '../../types/room';
import { ROOM_TYPES, STANDARD_FACILITIES } from '../../lib/constants';
import { parseIDRInput, formatNumberThousand } from '../../lib/currency';

interface SingleAddModalProps {
  isOpen: boolean;
  existingRooms: Room[];
  onClose: () => void;
  onAddRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function SingleAddModal({
  isOpen,
  existingRooms,
  onClose,
  onAddRoom,
}: SingleAddModalProps) {
  if (!isOpen) return null;

  const [roomNumber, setRoomNumber] = useState<string>('');
  const [floor, setFloor] = useState<number>(1);
  const [type, setType] = useState<RoomType>('STANDARD');
  const [priceMonthly, setPriceMonthly] = useState<number>(1500000);
  const [priceRaw, setPriceRaw] = useState<string>('1.500.000');
  const [facilities, setFacilities] = useState<string[]>([
    'AC',
    'Kamar Mandi Dalam',
    'Wifi',
    'Kasur',
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleFacility = (facility: string) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter((f) => f !== facility));
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseIDRInput(rawVal);
    setPriceMonthly(parsed);
    setPriceRaw(formatNumberThousand(parsed));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanNum = roomNumber.trim();
    if (!cleanNum) {
      setErrorMsg('Nomor kamar wajib diisi.');
      return;
    }

    const isDuplicate = existingRooms.some(
      (r) => r.roomNumber.trim().toUpperCase() === cleanNum.toUpperCase()
    );
    if (isDuplicate) {
      setErrorMsg(`Nomor kamar "${cleanNum}" sudah dipakai di properti ini. Gunakan nomor lain.`);
      return;
    }

    if (priceMonthly <= 0) {
      setErrorMsg('Harga sewa bulanan wajib lebih dari Rp 0.');
      return;
    }

    onAddRoom({
      propertyId: 'prop-amartha-01',
      ownerId: 'owner-anggara-01',
      roomNumber: cleanNum,
      floor,
      type,
      priceMonthly,
      facilities,
      status: 'VACANT',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Tambah Satu Kamar</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kamar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Contoh: 105"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lantai
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(parseInt(e.target.value, 10))}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={1}>Lantai 1</option>
                <option value={2}>Lantai 2</option>
                <option value={3}>Lantai 3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Kamar
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarif Bulanan (Rp)
              </label>
              <input
                type="text"
                value={priceRaw}
                onChange={handlePriceChange}
                placeholder="1.500.000"
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fasilitas Kamar
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STANDARD_FACILITIES.map((fac) => {
                const isSelected = facilities.includes(fac);
                return (
                  <button
                    type="button"
                    key={fac}
                    onClick={() => toggleFacility(fac)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    <span>{fac}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
            >
              Simpan Kamar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
