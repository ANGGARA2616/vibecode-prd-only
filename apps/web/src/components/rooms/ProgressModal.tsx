'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  progress: number; // 0 to 100
  totalRooms: number;
}

export function ProgressModal({ isOpen, progress, totalRooms }: ProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 animate-spin">
          <Loader2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Menyimpan {totalRooms} Unit Kamar...
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Sistem sedang memproses pendaftaran kamar dan memverifikasi keunikan nomor.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>Memproses data batch</span>
          <span className="text-blue-600 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
