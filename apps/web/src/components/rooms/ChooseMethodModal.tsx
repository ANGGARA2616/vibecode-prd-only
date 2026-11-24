'use client';

import React from 'react';
import { X, Sparkles, Copy, Plus, ArrowRight } from 'lucide-react';

interface ChooseMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMassive: () => void;
  onSelectDuplicate: () => void;
  onSelectSingle: () => void;
}

export function ChooseMethodModal({
  isOpen,
  onClose,
  onSelectMassive,
  onSelectDuplicate,
  onSelectSingle,
}: ChooseMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="modal-choose"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Pilih Cara Menambah Kamar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tentukan metode pendaftaran unit yang paling efisien untuk kebutuhan Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option Cards */}
        <div className="p-6 space-y-3">
          {/* Card 1: Tambah Kamar Massal (Recommended) */}
          <div
            onClick={onSelectMassive}
            className="option-card highlight group relative border-2 border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
          >
            <div className="absolute top-3 right-3">
              <span className="text-[11px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Rekomendasi
              </span>
            </div>

            <div className="flex items-start gap-3.5 pr-24">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  Tambah Kamar Massal
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Isi spesifikasi seragam cukup satu kali, sistem mengenerasi puluhan nomor kamar otomatis dengan pratinjau tabel sebelum simpan.
                </p>
                <div className="mt-2 text-[11px] text-blue-700 font-semibold">
                  Cocok untuk: gedung baru, lantai baru, klaster kamar sejenis.
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Duplikat Kamar Eksisting */}
          <div
            onClick={onSelectDuplicate}
            className="option-card group border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80 rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base flex-shrink-0 border border-slate-200">
                <Copy className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors flex items-center gap-1.5">
                  Duplikat dari Kamar yang Ada
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Salin tipe, fasilitas, dan harga dari kamar acuan ke kamar-kamar baru tanpa perlu mengetik ulang form.
                </p>
                <div className="mt-2 text-[11px] text-slate-600 font-medium">
                  Cocok untuk: menambah 1–5 kamar yang setara dengan kamar yang sudah ada.
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Tambah Satu Kamar */}
          <div
            onClick={onSelectSingle}
            className="option-card group border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/80 rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base flex-shrink-0 border border-slate-200">
                <Plus className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors flex items-center gap-1.5">
                  Tambah Satu Kamar
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Formulir konvensional untuk mendaftarkan 1 unit kamar tunggal secara manual.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
