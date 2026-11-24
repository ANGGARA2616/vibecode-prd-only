'use client';

import React from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  Receipt, 
  CheckCircle2, 
  MessageSquareWarning, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentRoomsCount: number;
}

export function Sidebar({ currentRoomsCount }: SidebarProps) {
  const navItems = [
    { label: 'Dashboard', icon: Home, active: false },
    { label: 'Properti', icon: Building2, active: true, badge: currentRoomsCount.toString() },
    { label: 'Penghuni', icon: Users, active: false, badge: '2' },
    { label: 'Tagihan', icon: Receipt, active: false },
    { label: 'Verifikasi Bukti', icon: CheckCircle2, active: false, dangerBadge: '1' },
    { label: 'Komplain', icon: MessageSquareWarning, active: false },
    { label: 'Laporan', icon: BarChart3, active: false },
    { label: 'Pengaturan', icon: Settings, active: false },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-400 flex-shrink-0 flex flex-col min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          N
        </div>
        <div>
          <div className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
            Ngekost
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">Pro</span>
          </div>
          <div className="text-[11px] text-slate-500">Kelola Kost Pintar</div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-slate-500 px-3 py-1 uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                item.active
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.active ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10.5px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
              {item.dangerBadge && (
                <span className="text-[10.5px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {item.dangerBadge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Pro Tip */}
      <div className="p-3 m-3 bg-slate-800/60 border border-slate-800 rounded-lg">
        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fitur Massal Aktif</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Tambah banyak kamar sekaligus dengan generator penomoran otomatis.
        </p>
      </div>
    </aside>
  );
}
