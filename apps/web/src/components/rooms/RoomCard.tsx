'use client';

import React from 'react';
import { Copy, User, Check, Sparkles } from 'lucide-react';
import { Room } from '../../types/room';
import { ROOM_TYPES } from '../../lib/constants';
import { formatIDR } from '../../lib/currency';

interface RoomCardProps {
  room: Room;
  onDuplicate: (room: Room) => void;
}

export function RoomCard({ room, onDuplicate }: RoomCardProps) {
  const typeConfig = ROOM_TYPES.find((t) => t.value === room.type) || ROOM_TYPES[0];
  const isOccupied = room.status === 'OCCUPIED';

  return (
    <div className="room-card bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${typeConfig.badgeColor}`}>
            {typeConfig.label}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isOccupied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {isOccupied ? 'Terisi' : 'Kosong'}
          </span>
        </div>

        {/* Room Number & Floor */}
        <div className="mb-2">
          <div className="text-[11px] text-slate-400 font-medium">Nomor Kamar</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>Kamar {room.roomNumber}</span>
            {room.floor && (
              <span className="text-xs font-semibold text-slate-500">
                (Lt. {room.floor})
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-sm font-extrabold text-blue-600 mb-3">
          {formatIDR(room.priceMonthly)}
          <span className="text-xs font-normal text-slate-500">/bln</span>
        </div>

        {/* Tenant Info if occupied */}
        {isOccupied && room.tenantName && (
          <div className="mb-3 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 text-xs text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Penghuni: <strong className="font-semibold">{room.tenantName}</strong></span>
          </div>
        )}

        {/* Facilities Chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {room.facilities.slice(0, 4).map((f, i) => (
            <span
              key={i}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium flex items-center gap-1"
            >
              <Check className="w-2.5 h-2.5 text-emerald-600" />
              {f}
            </span>
          ))}
          {room.facilities.length > 4 && (
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
              +{room.facilities.length - 4} lagi
            </span>
          )}
        </div>
      </div>

      {/* Card Action: Duplikat Kamar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Siap duplikasi</span>
        <button
          type="button"
          onClick={() => onDuplicate(room)}
          className="btn-duplicate inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
          title={`Duplikat spesifikasi Kamar ${room.roomNumber} ke kamar baru`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplikat</span>
        </button>
      </div>
    </div>
  );
}
