# Changelog

Semua perubahan penting pada proyek ini didokumentasikan dalam berkas ini.
Format penulisan berpedoman pada [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/), dan proyek ini mengadopsi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.3.0] - 2026-11-24

### Added
- Model data TypeScript (`Room`, `Property`, `MassGeneratorParams`, `RoomDraft`, `DuplicateParams`).
- Konstanta 8 fasilitas standar Ngekost (`AC`, `Kamar Mandi Dalam`, `Wifi`, `Lemari`, `Kasur`, `Meja Belajar`, `TV`, `Dapur`) dan 4 tipe kamar (`STANDARD`, `DELUXE`, `VIP`, `EXCLUSIVE`).
- Generator penomoran otomatis dengan penghitungan rentang nomor dan chip pratinjau dinamis (FR-02, FR-03).
- Validasi keunikan nomor kamar terhadap data properti lokal dan batch input (FR-04).
- Algoritma auto-koreksi nomor kamar yang bentrok (FR-05).
- Modul persistensi data berbasis `localStorage` dengan *mock seed data* 4 kamar awal dan opsi *clear/reset* (FR-08).

## [0.2.0] - 2026-11-24

### Added
- Konfigurasi monorepo dengan root `package.json` workspaces (`apps/*`).
- Inisialisasi proyek Next.js 14 (App Router) + TypeScript + Tailwind CSS pada direktori `apps/web`.
- Instalasi dependensi: Next.js, React, Tailwind CSS, Lucide React, clsx, tailwind-merge.

## [0.1.0] - 2026-11-24

### Added
- Inisialisasi dokumentasi PRD ke `README.md` yang memuat seluruh spesifikasi fungsional (FR-01 s.d. FR-10) dan UX (UX-01 s.d. UX-07) berdasarkan Worksheet 8 dan Worksheet 12.
- Inisialisasi `CHANGELOG.md` dengan format *Keep a Changelog*.
- Penentuan konfigurasi monorepo dengan root workspace mengarah ke `apps/*`.

### Assumptions
- Seluruh kebutuhan teknis berpedoman tunggal pada `README.md` (bekas `PRD.md`) tanpa penambahan pustaka/dokumen instruksi di luar PRD.
- Penyimpanan data pada tingkat MVP menggunakan `localStorage` dengan *fallback* *seed mock data* realistis saat pertama kali aplikasi dibuka.
- Format penomoran kamar menggunakan kombinasi string alfanumerik (awalan/prefix + nomor urut).
