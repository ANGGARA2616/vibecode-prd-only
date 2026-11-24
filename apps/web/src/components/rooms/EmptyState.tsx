'use client';

import React from 'react';
import { BedDouble, Sparkles, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddMassive: () => void;
  onAddSingle: () => void;
  onRestoreSeed: () => void;
}

export function EmptyState({ onAddMassive, onAddSingle, onRestoreSeed }: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto my-8 shadow-sm">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
        <BedDouble className="w-8 h-8" />
      </div>

      {/* Headings */}
      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
        Belum Ada Unit Kamar di Properti Ini
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Gedung properti ini belum memiliki kamar yang terdaftar. Tambahkan banyak kamar sejenis sekaligus dengan generator nomor otomatis agar hemat waktu.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAddMassive}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>⚡ Tambah Beberapa Kamar Sekaligus</span>
        </button>

        <button
          type="button"
          onClick={onAddSingle}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          <span>Tambah Satu Kamar</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
        <span className="text-xs text-slate-400">Atau kembalikan data simulasi:</span>
        <button
          type="button"
          onClick={onRestoreSeed}
          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Muat 4 Kamar Bawaan</span>
        </button>
      </div>
    </div>
  );
}
