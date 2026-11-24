'use client';

import React from 'react';
import { ChevronRight, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  propertyName: string;
  currentScreenTitle?: string;
  onNavigateHome?: () => void;
}

export function Header({ propertyName, currentScreenTitle, onNavigateHome }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-7 flex items-center justify-between sticky top-0 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span 
          onClick={onNavigateHome}
          className="hover:text-slate-800 cursor-pointer transition-colors"
        >
          Properti
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span 
          onClick={onNavigateHome}
          className="font-semibold text-slate-900 cursor-pointer hover:underline"
        >
          {propertyName}
        </span>
        {currentScreenTitle && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">{currentScreenTitle}</span>
          </>
        )}
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            MA
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">M. Anggara</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Pengelola Kost</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
