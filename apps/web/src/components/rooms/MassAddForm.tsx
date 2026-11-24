'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Layers, 
  Hash, 
  DollarSign, 
  SlidersHorizontal,
  AlertCircle 
} from 'lucide-react';
import { MassGeneratorParams, RoomDraft, RoomType } from '../../types/room';
import { STANDARD_FACILITIES, ROOM_TYPES } from '../../lib/constants';
import { calculateRoomRange, generateRoomDrafts } from '../../lib/room-generator';
import { formatNumberThousand, parseIDRInput, formatIDR } from '../../lib/currency';

interface MassAddFormProps {
  initialParams?: Partial<MassGeneratorParams>;
  onCancel: () => void;
  onProceed: (params: MassGeneratorParams, drafts: RoomDraft[]) => void;
}

export function MassAddForm({ initialParams, onCancel, onProceed }: MassAddFormProps) {
  // Form State
  const [type, setType] = useState<RoomType>(initialParams?.type || 'STANDARD');
  const [floor, setFloor] = useState<number>(initialParams?.floor || 2);
  const [facilities, setFacilities] = useState<string[]>(
    initialParams?.facilities || ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur']
  );
  const [priceMonthly, setPriceMonthly] = useState<number>(
    initialParams?.priceMonthly || 1500000
  );
  const [priceRaw, setPriceRaw] = useState<string>(
    formatNumberThousand(initialParams?.priceMonthly || 1500000)
  );

  // Generator State
  const [count, setCount] = useState<number>(initialParams?.count || 6);
  const [prefix, setPrefix] = useState<string>(initialParams?.prefix || '20');
  const [startNumber, setStartNumber] = useState<number>(initialParams?.startNumber || 1);

  // Validation Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic calculated range & preview drafts
  const calculatedRange = useMemo(() => {
    return calculateRoomRange(prefix, startNumber, count);
  }, [prefix, startNumber, count]);

  const generatedPreviewNumbers = useMemo(() => {
    const list: string[] = [];
    const safeCount = Math.max(1, Math.min(50, count));
    for (let i = 0; i < safeCount; i++) {
      list.push(`${prefix}${startNumber + i}`);
    }
    return list;
  }, [prefix, startNumber, count]);

  // Facility Toggle Handler (UX-01 instant multi-select)
  const toggleFacility = (facility: string) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter((f) => f !== facility));
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  // Price input handler with IDR masking
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseIDRInput(rawVal);
    setPriceMonthly(parsed);
    setPriceRaw(formatNumberThousand(parsed));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validations
    if (count < 1 || count > 50) {
      setErrorMsg('Jumlah kamar yang ditambahkan harus antara 1 sampai 50 unit.');
      return;
    }
    if (priceMonthly <= 0) {
      setErrorMsg('Harga sewa bulanan wajib diisi dan lebih dari Rp 0.');
      return;
    }
    if (startNumber < 0) {
      setErrorMsg('Nomor urut awal harus berupa angka 0 atau lebih besar.');
      return;
    }
    if (prefix.length > 10) {
      setErrorMsg('Awalan nomor kamar maksimal 10 karakter.');
      return;
    }

    const finalParams: MassGeneratorParams = {
      type,
      floor,
      facilities,
      priceMonthly,
      count,
      prefix,
      startNumber,
    };

    const drafts = generateRoomDrafts(finalParams);
    onProceed(finalParams, drafts);
  };

  return (
    <div id="screen-form-massal" className="max-w-5xl mx-auto py-2">
      {/* Top Breadcrumb / Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Kamar</span>
        </button>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 1 dari 2 • Konfigurasi Masukan</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Formulir Tambah Kamar Massal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tentukan spesifikasi kamar yang seragam dan parameter generator penomoran otomatis. Seluruh kamar dapat diperiksa pada tabel ringkasan sebelum disimpan.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ── KOLOM KIRI: SPESIFIKASI KAMAR SERAGAM (FR-01, UX-01) ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  1. Spesifikasi Kamar Seragam
                </h2>
              </div>

              {/* Tipe Kamar & Lantai */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tipe Kamar <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="input-room-type"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lantai Gedung <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="input-floor"
                    value={floor}
                    onChange={(e) => setFloor(parseInt(e.target.value, 10))}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value={1}>Lantai 1</option>
                    <option value={2}>Lantai 2</option>
                    <option value={3}>Lantai 3</option>
                    <option value={4}>Lantai 4</option>
                  </select>
                </div>
              </div>

              {/* Fasilitas Kamar (8 Standar Ngekost Chips) */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Fasilitas Kamar Seragam
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {facilities.length} fasilitas dipilih
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STANDARD_FACILITIES.map((fac) => {
                    const isSelected = facilities.includes(fac);
                    return (
                      <button
                        type="button"
                        key={fac}
                        onClick={() => toggleFacility(fac)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            isSelected ? 'bg-blue-600 text-white' : 'border border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span>{fac}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Harga Sewa Bulanan */}
              <div className="mb-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tarif Sewa Bulanan (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                    Rp
                  </div>
                  <input
                    type="text"
                    id="input-price"
                    value={priceRaw}
                    onChange={handlePriceChange}
                    placeholder="1.500.000"
                    className="w-full text-xs font-semibold pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Format otomatis: {formatIDR(priceMonthly)} per bulan untuk tiap unit.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              💡 Seluruh kamar yang dihasilkan akan memiliki tipe, lantai, fasilitas, dan harga sewa yang sama.
            </div>
          </div>

          {/* ── KOLOM KANAN: GENERATOR PENOMORAN OTOMATIS (FR-02, FR-03, UX-02) ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
                <Hash className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  2. Generator Penomoran Otomatis
                </h2>
              </div>

              {/* Jumlah Kamar & Prefix */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jumlah Kamar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="gen-count"
                    min={1}
                    max={50}
                    value={count || ''}
                    onChange={(e) => setCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Batas: 1 s.d. 50 kamar
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Awalan Nomor (Prefix)
                  </label>
                  <input
                    type="text"
                    id="gen-prefix"
                    maxLength={10}
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Contoh: 10, 20, A-"
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Opsional (misal: "20" untuk 201)
                  </div>
                </div>
              </div>

              {/* Nomor Urut Mulai */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Urut Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="gen-start"
                  min={0}
                  value={startNumber}
                  onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Calculated Range Display (Read-only box) */}
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Rentang Nomor Terhitung
                </div>
                <input
                  type="text"
                  id="gen-range-display"
                  readOnly
                  value={calculatedRange}
                  className="w-full bg-transparent text-sm font-black text-slate-900 border-none p-0 focus:outline-none"
                />
              </div>

              {/* Dynamic Chips Preview of Generated Numbers (UX-02) */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Pratinjau Nomor Kamar ({generatedPreviewNumbers.length}):</span>
                  <span className="text-[11px] text-blue-600 font-medium">Real-time Preview</span>
                </div>
                <div className="max-h-28 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-1.5">
                  {generatedPreviewNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-lg shadow-2xs"
                    >
                      Kamar {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              ⚡ Nomor-nomor ini dapat dikoreksi atau disesuaikan satu per satu di tabel ringkasan sebelum disimpan.
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all hover:shadow-lg"
          >
            <span>Lanjut ke Pratinjau & Ringkasan →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
