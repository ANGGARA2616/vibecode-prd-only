'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Layers, Building2 } from 'lucide-react';
import { Room, Property, RoomDraft, MassGeneratorParams } from '../types/room';
import { 
  getStoredRooms, 
  saveStoredRooms, 
  getStoredProperty, 
  clearAllRooms, 
  resetToDefaultSeed 
} from '../lib/storage';
import { DEFAULT_PROPERTY } from '../lib/constants';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { PropertyHero } from '../components/rooms/PropertyHero';
import { RoomCard } from '../components/rooms/RoomCard';
import { EmptyState } from '../components/rooms/EmptyState';
import { ChooseMethodModal } from '../components/rooms/ChooseMethodModal';
import { MassAddForm } from '../components/rooms/MassAddForm';
import { SummaryTable } from '../components/rooms/SummaryTable';
import { ProgressModal } from '../components/rooms/ProgressModal';
import { SuccessModal } from '../components/rooms/SuccessModal';
import { DuplicateModal } from '../components/rooms/DuplicateModal';
import { SingleAddModal } from '../components/rooms/SingleAddModal';
import { generateRoomDrafts } from '../lib/room-generator';

type ViewMode = 'LIST' | 'FORM_MASSAL' | 'SUMMARY';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [property, setProperty] = useState<Property>(DEFAULT_PROPERTY);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Navigation View
  const [currentView, setCurrentView] = useState<ViewMode>('LIST');

  // Modals State
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isSingleAddModalOpen, setIsSingleAddModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Flow State
  const [selectedSourceRoom, setSelectedSourceRoom] = useState<Room | null>(null);
  const [activeDrafts, setActiveDrafts] = useState<RoomDraft[]>([]);
  const [lastParams, setLastParams] = useState<MassGeneratorParams | null>(null);
  const [saveProgress, setSaveProgress] = useState(0);
  const [lastAddedCount, setLastAddedCount] = useState(0);

  // Initialize data on mount
  useEffect(() => {
    setIsClient(true);
    const stored = getStoredRooms();
    setRooms(stored);
    setProperty(getStoredProperty(stored.length));
  }, []);

  // Sync rooms to localStorage whenever changed
  const updateRoomsState = (newRooms: Room[]) => {
    setRooms(newRooms);
    saveStoredRooms(newRooms);
    setProperty((prev) => ({
      ...prev,
      totalRooms: newRooms.length,
      vacantRooms: newRooms.filter((r) => r.status === 'VACANT').length,
      occupiedRooms: newRooms.filter((r) => r.status === 'OCCUPIED').length,
    }));
  };

  // ── HANDLERS: DEMO BAR ──
  const handleTriggerEmptyState = () => {
    clearAllRooms();
    updateRoomsState([]);
    setCurrentView('LIST');
  };

  const handleResetSeed = () => {
    const seed = resetToDefaultSeed();
    updateRoomsState(seed);
    setCurrentView('LIST');
  };

  const handleTriggerDuplicateDemo = () => {
    // Generate draft that intentionally collides with 101, 102, 103, 104
    const collisionParams: MassGeneratorParams = {
      type: 'STANDARD',
      floor: 1,
      facilities: ['AC', 'Kamar Mandi Dalam', 'Wifi', 'Kasur'],
      priceMonthly: 1500000,
      count: 4,
      prefix: '10',
      startNumber: 1, // Will create 101, 102, 103, 104
    };
    const drafts = generateRoomDrafts(collisionParams);
    setLastParams(collisionParams);
    setActiveDrafts(drafts);
    setCurrentView('SUMMARY');
  };

  // ── HANDLERS: MAIN FLOW ──
  const handleOpenChooseModal = () => {
    setIsChooseModalOpen(true);
  };

  const handleSelectMassiveMethod = () => {
    setIsChooseModalOpen(false);
    setCurrentView('FORM_MASSAL');
  };

  const handleSelectDuplicateMethod = () => {
    setIsChooseModalOpen(false);
    if (rooms.length > 0) {
      setSelectedSourceRoom(rooms[0]);
      setIsDuplicateModalOpen(true);
    } else {
      // If no rooms, fall back to mass add form
      setCurrentView('FORM_MASSAL');
    }
  };

  const handleSelectSingleMethod = () => {
    setIsChooseModalOpen(false);
    setIsSingleAddModalOpen(true);
  };

  const handleCardDuplicateClick = (room: Room) => {
    setSelectedSourceRoom(room);
    setIsDuplicateModalOpen(true);
  };

  const handleFormProceedToSummary = (
    params: MassGeneratorParams,
    drafts: RoomDraft[]
  ) => {
    setLastParams(params);
    setActiveDrafts(drafts);
    setCurrentView('SUMMARY');
  };

  // ── SAVING BATCH ROOMS (SCREEN 7A & 7B) ──
  const executeSaveBatch = (validDrafts: RoomDraft[]) => {
    setIsProgressModalOpen(true);
    setSaveProgress(10);
    setLastAddedCount(validDrafts.length);

    // Simulated progress bar animation (0% -> 100%)
    let currentPct = 10;
    const interval = setInterval(() => {
      currentPct += 25;
      if (currentPct >= 100) {
        clearInterval(interval);
        setSaveProgress(100);

        setTimeout(() => {
          // Convert drafts to Room objects
          const now = new Date().toISOString();
          const createdRooms: Room[] = validDrafts.map((d, i) => ({
            id: `room-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
            propertyId: property.id,
            ownerId: 'owner-anggara-01',
            roomNumber: d.roomNumber,
            floor: d.floor,
            type: d.type,
            priceMonthly: d.priceMonthly,
            facilities: [...d.facilities],
            status: 'VACANT',
            notes: 'Ditambahkan via Tambah Kamar Massal',
            createdAt: now,
            updatedAt: now,
          }));

          const updated = [...rooms, ...createdRooms];
          updateRoomsState(updated);

          setIsProgressModalOpen(false);
          setIsSuccessModalOpen(true);
        }, 300);
      } else {
        setSaveProgress(currentPct);
      }
    }, 180);
  };

  // Duplicate modal submission
  const handleConfirmDuplicate = (
    newRoomsData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    setIsDuplicateModalOpen(false);
    setIsProgressModalOpen(true);
    setSaveProgress(20);
    setLastAddedCount(newRoomsData.length);

    let currentPct = 20;
    const interval = setInterval(() => {
      currentPct += 30;
      if (currentPct >= 100) {
        clearInterval(interval);
        setSaveProgress(100);

        setTimeout(() => {
          const now = new Date().toISOString();
          const createdRooms: Room[] = newRoomsData.map((d, i) => ({
            ...d,
            id: `room-dup-${Date.now()}-${i}`,
            createdAt: now,
            updatedAt: now,
          }));

          const updated = [...rooms, ...createdRooms];
          updateRoomsState(updated);

          setIsProgressModalOpen(false);
          setIsSuccessModalOpen(true);
        }, 300);
      } else {
        setSaveProgress(currentPct);
      }
    }, 150);
  };

  // Single add modal submission
  const handleSingleAddRoom = (
    roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSingleAddModalOpen(false);
    const now = new Date().toISOString();
    const createdRoom: Room = {
      ...roomData,
      id: `room-single-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...rooms, createdRoom];
    updateRoomsState(updated);
  };

  const handleViewRooms = () => {
    setIsSuccessModalOpen(false);
    setCurrentView('LIST');
  };

  const handleAddMore = () => {
    setIsSuccessModalOpen(false);
    setCurrentView('FORM_MASSAL');
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-semibold text-sm">
        Memuat Ngekost...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── SIDEBAR (SCREEN ARCHITECTURE) ── */}
      <Sidebar currentRoomsCount={rooms.length} />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          propertyName={property.name}
          currentScreenTitle={
            currentView === 'FORM_MASSAL'
              ? 'Tambah Kamar Massal'
              : currentView === 'SUMMARY'
              ? 'Pratinjau & Ringkasan'
              : undefined
          }
          onNavigateHome={() => setCurrentView('LIST')}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* VIEW 1: DAFTAR KAMAR / EMPTY STATE (SCREEN 1 & 2) */}
          {currentView === 'LIST' && (
            <div>
              <PropertyHero
                property={property}
                rooms={rooms}
                onTriggerEmptyState={handleTriggerEmptyState}
                onResetSeed={handleResetSeed}
                onTriggerDuplicateDemo={handleTriggerDuplicateDemo}
              />

              {rooms.length === 0 ? (
                /* SCREEN 2: EMPTY STATE */
                <EmptyState
                  onAddMassive={() => setCurrentView('FORM_MASSAL')}
                  onAddSingle={() => setIsSingleAddModalOpen(true)}
                  onRestoreSeed={handleResetSeed}
                />
              ) : (
                /* SCREEN 1: DAFTAR KAMAR GRID */
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Daftar Unit Kamar
                      </h2>
                      <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded-full">
                        {rooms.length} Unit
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsSingleAddModalOpen(true)}
                        className="btn-outline inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Kamar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenChooseModal}
                        className="btn-primary inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:shadow-lg"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>⚡ + Tambah Beberapa Kamar Sekaligus</span>
                      </button>
                    </div>
                  </div>

                  {/* Rooms Cards Grid (4 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onDuplicate={handleCardDuplicateClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: FORM TAMBAH KAMAR MASSAL (SCREEN 4) */}
          {currentView === 'FORM_MASSAL' && (
            <MassAddForm
              initialParams={lastParams || undefined}
              onCancel={() => setCurrentView('LIST')}
              onProceed={handleFormProceedToSummary}
            />
          )}

          {/* VIEW 3: PRATINJAU & RINGKASAN / ERROR STATE (SCREEN 5 & 6) */}
          {currentView === 'SUMMARY' && (
            <SummaryTable
              drafts={activeDrafts}
              existingRooms={rooms}
              onBackToForm={() => setCurrentView('FORM_MASSAL')}
              onSaveRooms={executeSaveBatch}
            />
          )}
        </main>
      </div>

      {/* ── MODALS (SCREEN 3, SCREEN 7A/7B, SCREEN 8) ── */}

      {/* SCREEN 3: PILIH CARA MENAMBAH KAMAR */}
      <ChooseMethodModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
        onSelectMassive={handleSelectMassiveMethod}
        onSelectDuplicate={handleSelectDuplicateMethod}
        onSelectSingle={handleSelectSingleMethod}
      />

      {/* SCREEN 8: MODAL DUPLIKAT KAMAR */}
      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        sourceRoom={selectedSourceRoom}
        existingRooms={rooms}
        onClose={() => setIsDuplicateModalOpen(false)}
        onConfirmDuplicate={handleConfirmDuplicate}
      />

      {/* MODAL TAMBAH SATU KAMAR */}
      <SingleAddModal
        isOpen={isSingleAddModalOpen}
        existingRooms={rooms}
        onClose={() => setIsSingleAddModalOpen(false)}
        onAddRoom={handleSingleAddRoom}
      />

      {/* SCREEN 7A: MODAL PROGRES SIMPAN ANIMASI */}
      <ProgressModal
        isOpen={isProgressModalOpen}
        progress={saveProgress}
        totalRooms={lastAddedCount}
      />

      {/* SCREEN 7B: MODAL KONFIRMASI BERHASIL */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        addedCount={lastAddedCount}
        onViewRooms={handleViewRooms}
        onAddMore={handleAddMore}
      />
    </div>
  );
}
