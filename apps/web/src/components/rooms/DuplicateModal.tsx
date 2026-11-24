'use client';

import React, { useState, useMemo } from 'react';
import { X, Copy, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { Room } from '../../types/room';
import { ROOM_TYPES } from '../../lib/constants';
import { formatIDR } from '../../lib/currency';

interface DuplicateModalProps {
  isOpen: boolean;
  sourceRoom: Room | null;
  existingRooms: Room[];
  onClose: () => void;
  onConfirmDuplicate: (newRooms: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export function DuplicateModal({
  isOpen,
  sourceRoom,
  existingRooms,
  onClose,
  onConfirmDuplicate,
}: DuplicateModalProps) {
  if (!isOpen || !sourceRoom) return null;

  const [count, setCount] = useState<number>(2);
  const [prefix, setPrefix] = useState<string>('10');
  const [startNum, setStartNum] = useState<number>(5);

  // Editable custom room numbers
  const [customNumbers, setCustomNumbers] = useState<string[]>(['105', '106']);

  // Handle count change
  const handleCountChange = (val: number) => {
    const safeCount = Math.max(1, Math.min(20, val));
    setCount(safeCount);

    const generated: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      generated.push(`${prefix}${startNum + i}`);
    }
    setCustomNumbers(generated);
  };

  // Handle prefix change
  const handlePrefixChange = (p: string) => {
    setPrefix(p);
    const generated: string[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(`${p}${startNum + i}`);
    }
    setCustomNumbers(generated);
  };

  // Handle single room number edit
  const handleNumberChange = (index: number, val: string) => {
    const updated = [...customNumbers];
    updated[index] = val;
    setCustomNumbers(updated);
  };

  // Check duplicates
  const existingSet = useMemo(() => {
    return new Set(existingRooms.map((r) => r.roomNumber.trim().toUpperCase()));
  }, [existingRooms]);

  const duplicateErrors = useMemo(() => {
    const seen = new Set<string>();
    const dupes: string[] = [];

    customNumbers.forEach((num) => {
      const clean = num.trim().toUpperCase();
      if (!clean) return;
      if (existingSet.has(clean) || seen.has(clean)) {
        dupes.push(num);
      }
      seen.add(clean);
    });
    return dupes;
  }, [customNumbers, existingSet]);

  const hasDuplicate = duplicateErrors.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasDuplicate) return;

    const newRoomsToCreate: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>[] = customNumbers.map(
      (roomNumber) => ({
        propertyId: sourceRoom.propertyId,
        ownerId: sourceRoom.ownerId,
        roomNumber,
        floor: sourceRoom.floor,
        type: sourceRoom.type,
        priceMonthly: sourceRoom.priceMonthly,
        facilities: [...sourceRoom.facilities],
        status: 'VACANT',
        notes: `Hasil duplikasi dari Kamar ${sourceRoom.roomNumber}`,
      })
    );

    onConfirmDuplicate(newRoomsToCreate);
  };

  const typeConfig =
    ROOM_TYPES.find((t) => t.value === sourceRoom.type) || ROOM_TYPES[0];

  return (
    <div
      id="modal-duplicate"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Duplikat dari Kamar {sourceRoom.roomNumber}
              </h2>
              <p className="text-xs text-slate-500">
                Salin spesifikasi kamar ke unit baru tanpa mengulang formulir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Source Room Summary Card */}
          <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Spesifikasi Kamar Acuan
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${typeConfig.badgeColor}`}>
                  {typeConfig.label}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Lt. {sourceRoom.floor || 1}
                </span>
              </div>
              <div className="text-xs font-extrabold text-blue-600">
                {formatIDR(sourceRoom.priceMonthly)}/bln
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {sourceRoom.facilities.map((fac, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Duplication Controls */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Kamar Baru
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => handleCountChange(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Awalan Nomor (Prefix)
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* New Room Numbers Grid */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Nomor Kamar Baru (Dapat Diubah):</span>
              <span className="text-[11px] text-slate-400">Langsung edit di kotak</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {customNumbers.map((num, i) => {
                const isDupe =
                  existingSet.has(num.trim().toUpperCase()) ||
                  customNumbers.filter((x) => x.trim().toUpperCase() === num.trim().toUpperCase())
                    .length > 1;

                return (
                  <div key={i} className="relative">
                    <input
                      type="text"
                      value={num}
                      onChange={(e) => handleNumberChange(i, e.target.value)}
                      className={`w-full text-xs font-bold text-center py-1.5 px-2 rounded-lg border focus:outline-none ${
                        isDupe
                          ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400/30'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error notice if duplicates detected */}
          {hasDuplicate && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>
                Nomor kamar <strong>{duplicateErrors.join(', ')}</strong> sudah terdaftar atau kembar. Mohon ubah nomor tersebut.
              </span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={hasDuplicate}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                hasDuplicate
                  ? 'bg-slate-300 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Duplikat Kamar Sekarang ({count})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
