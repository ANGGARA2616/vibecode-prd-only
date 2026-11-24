'use client';

import React from 'react';
import { Building2, MapPin, Bed, UserCheck, DoorOpen, RotateCcw, AlertTriangle } from 'lucide-react';
import { Property, Room } from '../../types/room';

interface PropertyHeroProps {
  property: Property;
  rooms: Room[];
  onTriggerEmptyState: () => void;
  onResetSeed: () => void;
  onTriggerDuplicateDemo: () => void;
}

export function PropertyHero({
  property,
  rooms,
  onTriggerEmptyState,
  onResetSeed,
  onTriggerDuplicateDemo,
}: PropertyHeroProps) {
  const total = rooms.length;
  const occupied = rooms.filter((r) => r.status === 'OCCUPIED').length;
  const vacant = total - occupied;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{property.name}</h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Aktif
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="flex items-center gap-6 py-2 px-4 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] font-medium">
              <Bed className="w-3.5 h-3.5" />
              <span>Total Kamar</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">{total}</div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 text-[11px] font-medium">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Terisi</span>
            </div>
            <div className="text-lg font-extrabold text-emerald-700 mt-0.5">{occupied}</div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200" />

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 text-[11px] font-medium">
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Kosong</span>
            </div>
            <div className="text-lg font-extrabold text-blue-700 mt-0.5">{vacant}</div>
          </div>

          <div className="h-7 w-[1px] bg-slate-200" />

          <div className="text-center">
            <div className="text-slate-500 text-[11px] font-medium">Tingkat Hunian</div>
            <div className="text-lg font-extrabold text-slate-800 mt-0.5">{occupancyRate}%</div>
          </div>
        </div>
      </div>

      {/* Demo Controls Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[11px] font-medium text-slate-500">
          Mode Pengujian Prototipe:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onTriggerEmptyState}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors flex items-center gap-1"
            title="Kosongkan seluruh kamar untuk menguji Screen 2: Empty State"
          >
            <DoorOpen className="w-3 h-3 text-slate-500" />
            <span>Simulasi Empty State (0 Kamar)</span>
          </button>

          <button
            type="button"
            onClick={onTriggerDuplicateDemo}
            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-medium transition-colors flex items-center gap-1"
            title="Buka form massal dengan nomor kamar yang sengaja dibuat bentrok untuk menguji Screen 6"
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Uji Error Nomor Kembar</span>
          </button>

          <button
            type="button"
            onClick={onResetSeed}
            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium transition-colors flex items-center gap-1"
            title="Reset kamar kembali ke 4 kamar default"
          >
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Reset Data Default</span>
          </button>
        </div>
      </div>
    </div>
  );
}
