'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { Room } from '../../types/room';

interface SuccessModalProps {
  isOpen: boolean;
  addedCount: number;
  addedRoomsSample?: Room[];
  onViewRooms: () => void;
  onAddMore: () => void;
}

export function SuccessModal({
  isOpen,
  addedCount,
  onViewRooms,
  onAddMore,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="modal-success"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
          {addedCount} Kamar Berhasil Ditambahkan!
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Seluruh data kamar telah berhasil divalidasi dan tersimpan di sistem kost. Anda dapat langsung mengelola ketersediaan dan penempatan penghuni.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onViewRooms}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:shadow-lg"
          >
            <span>Lihat Daftar Kamar →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onAddMore}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kamar Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
}
