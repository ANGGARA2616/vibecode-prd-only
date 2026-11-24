'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Building 
} from 'lucide-react';
import { Room, RoomDraft } from '../../types/room';
import { formatIDR } from '../../lib/currency';
import { ROOM_TYPES } from '../../lib/constants';
import { autoCorrectDuplicates, validateDraftDuplicates } from '../../lib/room-generator';

interface SummaryTableProps {
  drafts: RoomDraft[];
  existingRooms: Room[];
  onBackToForm: () => void;
  onSaveRooms: (validDrafts: RoomDraft[]) => void;
}

export function SummaryTable({
  drafts: initialDrafts,
  existingRooms,
  onBackToForm,
  onSaveRooms,
}: SummaryTableProps) {
  // Local editable drafts
  const [drafts, setDrafts] = useState<RoomDraft[]>(initialDrafts);

  // Validate on the fly
  const validation = validateDraftDuplicates(drafts, existingRooms);
  const validatedDrafts = validation.validatedDrafts;
  const hasDuplicate = validation.hasDuplicate;

  // Handle inline room number change (UX-04 in-place editing)
  const handleRoomNumberChange = (tempId: string, newNumber: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.tempId === tempId ? { ...d, roomNumber: newNumber } : d))
    );
  };

  // Handle row deletion
  const handleDeleteRow = (tempId: string) => {
    setDrafts((prev) => prev.filter((d) => d.tempId !== tempId));
  };

  // Handle auto-correction (FR-05)
  const handleAutoFix = () => {
    const fixed = autoCorrectDuplicates(drafts, existingRooms);
    setDrafts(fixed);
  };

  // Calculate totals
  const totalCount = drafts.length;
  const totalPotentialRent = drafts.reduce((sum, d) => sum + d.priceMonthly, 0);

  // Handle save
  const handleSave = () => {
    if (hasDuplicate || totalCount === 0) return;
    onSaveRooms(drafts);
  };

  return (
    <div id="screen-summary" className="max-w-5xl mx-auto py-2">
      {/* Top Back Navigation */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onBackToForm}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Ubah Spesifikasi di Formulir</span>
        </button>
      </div>

      {/* Screen Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Langkah 2 dari 2 • Verifikasi Sebelum Simpan</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Pratinjau & Ringkasan Daftar Kamar
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Periksa seluruh data kamar yang akan dibuat. Anda dapat menyunting nomor kamar langsung di kolom tabel atau menghapus baris yang tidak diinginkan.
        </p>
      </div>

      {/* ── ERROR STATE BANNER (SCREEN 6 / FR-04 / UX-03) ── */}
      {hasDuplicate && (
        <div
          id="error-banner"
          className="mb-5 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-900 shadow-xs animate-in fade-in"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-900">
                  Ditemukan Nomor Kamar Kembar / Sudah Dipakai
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  Nomor berikut bentrok:{' '}
                  <strong className="underline">
                    {validation.duplicateNumbers.join(', ')}
                  </strong>
                  . Harap ganti nomor pada baris bersangkutan sebelum menyimpan.
                </p>
              </div>
            </div>

            {/* Auto-fix Button */}
            <button
              type="button"
              onClick={handleAutoFix}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Auto-Koreksi Nomor yang Kembar</span>
            </button>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE SUMMARY TABLE (SCREEN 5 / FR-06, FR-07) ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-44">Nomor Kamar (Dapat Diedit)</th>
                <th className="py-3 px-4 w-24">Lantai</th>
                <th className="py-3 px-4 w-28">Tipe</th>
                <th className="py-3 px-4">Fasilitas Kamar</th>
                <th className="py-3 px-4 w-36 text-right">Tarif Bulanan</th>
                <th className="py-3 px-4 w-16 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody id="summary-tbody" className="divide-y divide-slate-100 font-medium">
              {totalCount === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada unit kamar dalam daftar. Silakan kembali ke formulir.
                  </td>
                </tr>
              ) : (
                validatedDrafts.map((draft, idx) => {
                  const typeObj =
                    ROOM_TYPES.find((t) => t.value === draft.type) || ROOM_TYPES[0];
                  const isErr = draft.isDuplicate;

                  return (
                    <tr
                      key={draft.tempId}
                      className={`transition-colors ${
                        isErr
                          ? 'has-error bg-red-50/90 border-l-4 border-l-red-600 hover:bg-red-100/70'
                          : idx % 2 === 0
                          ? 'bg-white hover:bg-slate-50/80'
                          : 'bg-slate-50/40 hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3 px-4 text-center text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      {/* Room Number with In-place Inline Edit (FR-07) */}
                      <td className="py-2.5 px-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={draft.roomNumber}
                            onChange={(e) =>
                              handleRoomNumberChange(draft.tempId, e.target.value)
                            }
                            className={`w-full text-xs font-bold px-2.5 py-1.5 rounded border focus:outline-none transition-colors ${
                              isErr
                                ? 'border-red-500 bg-white text-red-900 ring-2 ring-red-400/30 font-black'
                                : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            }`}
                          />
                          {isErr && (
                            <div className="text-[10px] text-red-600 font-semibold mt-1">
                              {draft.errorMessage}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Floor */}
                      <td className="py-3 px-4 text-slate-700">
                        Lt. {draft.floor}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${typeObj.badgeColor}`}
                        >
                          {typeObj.label}
                        </span>
                      </td>

                      {/* Facilities Chips */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {draft.facilities.map((fac, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              {fac}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Price IDR */}
                      <td className="py-3 px-4 text-right font-extrabold text-blue-600">
                        {formatIDR(draft.priceMonthly)}
                      </td>

                      {/* Delete Action (FR-07) */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(draft.tempId)}
                          className="w-7 h-7 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors mx-auto"
                          title="Hapus baris kamar ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Total Summary Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Total Kamar Siap Dibuat</div>
              <div className="text-base font-extrabold text-slate-900">
                {totalCount} Unit Kamar
              </div>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Estimasi Potensi Sewa</div>
              <div className="text-base font-extrabold text-emerald-700">
                {formatIDR(totalPotentialRent)}
                <span className="text-xs font-normal text-slate-500">/bln</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToForm}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Ubah Parameter
            </button>

            <button
              type="button"
              id="btn-save-summary"
              disabled={hasDuplicate || totalCount === 0}
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                hasDuplicate || totalCount === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
              }`}
              title={
                hasDuplicate
                  ? 'Perbaiki nomor kamar yang bentrok terlebih dahulu sebelum menyimpan'
                  : 'Simpan seluruh kamar ke sistem'
              }
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Kamar ({totalCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
