# Changelog

Semua perubahan penting pada proyek ini didokumentasikan dalam berkas ini.
Format penulisan berpedoman pada [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/), dan proyek ini mengadopsi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.4.0] - 2026-11-24

### Added
- Implementasi penuh 8 layar antarmuka sesuai arsitektur wireframe Worksheet 12 dan PRD:
  - **Screen 1**: Daftar Kamar dengan hero stats properti, grid kartu kamar, badge status terisi/kosong, dan tombol aksi "Duplikat".
  - **Screen 2**: Empty State edukatif untuk properti 0 kamar dengan tombol CTA primer langsung ke penambahan massal.
  - **Screen 3**: Modal dialog "Pilih Cara Menambah Kamar" (Tambah Kamar Massal, Duplikat dari Kamar Eksisting, Tambah Satu Kamar).
  - **Screen 4**: Form Tambah Kamar Massal dengan 2 kolom (spesifikasi seragam tipe/lantai/8 fasilitas/harga, dan generator penomoran otomatis dengan rentang serta chip pratinjau dinamis).
  - **Screen 5**: Pratinjau & Ringkasan dalam wujud tabel data interaktif dengan fitur in-place inline edit nomor kamar dan hapus baris satuan.
  - **Screen 6**: Error State deteksi nomor kembar dengan spanduk peringatan deskriptif, sorotan merah pada baris bentrok, penonaktifan tombol simpan, dan tombol auto-koreksi.
  - **Screen 7**: Modal progres simpan animasi (7A: progress bar 0% s.d. 100%) dan modal konfirmasi sukses (7B: tajuk jumlah kamar berhasil ditambahkan).
  - **Screen 8**: Modal "Duplikat Kamar" dari kartu kamar acuan dengan kisi nomor kamar baru yang dapat langsung disunting.
- Bilah kontrol pengujian prototipe pada hero properti (Simulasi Empty State, Uji Error Nomor Kembar, Reset Data Bawaan).

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
