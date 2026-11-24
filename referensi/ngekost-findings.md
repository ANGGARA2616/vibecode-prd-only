# Ringkasan Temuan Riset Basis Kode Ngekost

Dokumen ini memuat hasil ekstraksi struktur data, istilah antarmuka, validasi, dan pola navigasi dari basis kode Ngekost (`C:\Users\Redd\Documents\antigravity\amazing-bell`) sebagai rujukan otentik perancangan Wireframe & Prototype Worksheet 12.

---

## 1. Tabel Pemetaan Temuan → File Sumber

| Aspek / Pertanyaan Riset | Temuan Nyata pada Basis Kode Ngekost | File Sumber (Path Relatif Repo) |
|---|---|---|
| **1. Skema / Model Data Kamar** | **Model `Room` (tabel `rooms`)**:<br>• `id`: String (cuid, primary key)<br>• `propertyId`: String (FK ke `Property`)<br>• `ownerId`: String (UUID pemilik)<br>• `roomNumber`: String (nomor kamar)<br>• `floor`: Int? (nomor lantai, opsional)<br>• `type`: RoomType enum (default: `STANDARD`)<br>• `priceMonthly`: Int (harga bulanan, wajib)<br>• `price3Months`: Int? (diskon tarif 3 bulan, opsional)<br>• `price6Months`: Int? (diskon tarif 6 bulan, opsional)<br>• `price12Months`: Int? (diskon tarif 12 bulan, opsional)<br>• `facilities`: String[] (array string fasilitas kamar)<br>• `imageUrl`: String? (foto kamar, opsional)<br>• `status`: RoomStatus enum (default: `VACANT`)<br>• `notes`: String? (catatan tambahan, opsional)<br>• `createdAt`, `updatedAt`: DateTime | `prisma/schema.prisma` (L129–L154) |
| **Relasi & Constraint Kamar** | • Relasi ke Properti: `property Property @relation(...)`<br>• Relasi ke Kontrak: `contracts RentalContract[]`<br>• Constraint Unik: `@@unique([propertyId, roomNumber])` (nomor kamar wajib unik dalam satu kost/properti)<br>• Indeks: `@@index([ownerId])`, `@@index([propertyId])` | `prisma/schema.prisma` (L148–L152) |
| **Status Kamar (`RoomStatus`)** | • `VACANT`: Kamar Kosong (Badge: bg `#FDECEC`, text `#E5484D`)<br>• `OCCUPIED`: Kamar Terisi (Badge: bg `#E6F6EE`, text `#16A572`)<br>• `RESERVED`: Reservasi (Badge: bg `#FFF4DD`, text `#C8830A`)<br>• `MAINTENANCE`: Pemeliharaan / Perbaikan (Badge: bg `#F1F3F8`, text `#7B8597`) | `prisma/schema.prisma` (L156–L161)<br>`src/app/(dashboard)/properties/[propertyId]/page.tsx` (L23–L28) |
| **2. Tipe Kamar (`RoomType`)** | Enum 4 nilai:<br>• `STANDARD` (label: "Standard")<br>• `DELUXE` (label: "Deluxe")<br>• `VIP` (label: "VIP")<br>• `EXCLUSIVE` (label: "Exclusive") | `prisma/schema.prisma` (L163–L168)<br>`src/components/rooms/room-form.tsx` (L21–L26) |
| **Daftar Fasilitas Standar** | Array `FACILITIES` (8 item):<br>`["AC", "Kamar Mandi Dalam", "Wifi", "Lemari", "Kasur", "Meja Belajar", "TV", "Dapur"]`<br>Ditampilkan sebagai interactive pill/chip toggle (multi-select). | `src/components/rooms/room-form.tsx` (L19) |
| **3. Istilah & Halaman Kamar yang Ada** | • Judul Halaman Induk: `[Nama Properti]` (misal: "Kost Griya Amartha")<br>• Sub-judul / Bagian: "Kamar" disertai pill counter `[jumlah kamar]`<br>• Tombol Aksi Utama: `+ Tambah Kamar` (membuka dialog modal tunggal)<br>• Kartu Kamar di Daftar: Menampilkan tipe kamar (uppercase kecil), badge status, nomor kamar ukuran besar (`text-[22px] font-extrabold`), dan harga sewa per bulan (`Rp X.XXX.XXX/bln`)<br>• Halaman Detail: `Kamar [roomNumber]`, tombol "Edit", "Tempatkan Penghuni", "Hapus" | `src/app/(dashboard)/properties/[propertyId]/page.tsx` (L98–L160)<br>`src/app/(dashboard)/properties/[propertyId]/rooms/[roomId]/page.tsx` |
| **Alur Tambah Kamar Eksisting** | Tombol `+ Tambah Kamar` membuka dialog modal `RoomDialog` yang merender `RoomForm`. Pengelola harus menginput satu per satu (Nomor Kamar, Lantai, Tipe Kamar, Fasilitas, Harga Sewa Bulanan & Diskon Durasi, Catatan). **Fitur tambah kamar massal dan duplikat kamar belum ada** di sistem saat ini. | `src/components/rooms/room-dialog.tsx`<br>`src/components/rooms/room-form.tsx` |
| **Empty State Kamar Eksisting** | Kontainer border garis putus-putus (`border-2 border-dashed border-[#EAEDF3] p-12 text-center`), ikon tempat tidur/kamar, teks: *"Belum ada kamar. Tambahkan kamar pertama."* | `src/app/(dashboard)/properties/[propertyId]/page.tsx` (L122–L129) |
| **4. Format Harga & Penomoran** | • Format Mata Uang: `formatIDR(number)` dengan pemisah titik ribuan (contoh: `Rp 1.500.000` atau input angka terformat otomatis `1.500.000`).<br>• Penomoran kamar: Tipe data String (misal: "101", "A1", "102"). | `src/lib/utils/currency.ts`<br>`src/components/rooms/room-form.tsx` (L29–L68) |
| **Pesan Validasi & Error yang Ada** | • Error Nomor Kembar: `"DUPLICATE_ROOM_NUMBER"` → `Nomor kamar "[nomor]" sudah dipakai di properti ini. Gunakan nomor lain.`<br>• Error Batas Paket Langganan: `"LIMIT_REACHED"` → `Batas kamar pada paket Anda sudah tercapai. Upgrade untuk menambah lebih banyak kamar.`<br>• Validasi Zod: `Nomor kamar wajib diisi`, `Harga wajib diisi`. | `src/lib/actions/room.actions.ts` (L30–L35)<br>`src/lib/validations/room.ts` (L3–L13) |
| **5. Platform Dominan & Struktur Navigasi** | **Desktop Web Dashboard** (responsif): Sidebar tetap di sisi kiri (lebar ~250px), header di atas, konten utama di area tengah/kanan.<br>Struktur Navigasi Sidebar Ngekost:<br>1. Dashboard (`/dashboard`)<br>2. Properti (`/properties`)<br>3. Penghuni (`/tenants`)<br>4. Tagihan (`/billing`)<br>5. Verifikasi Bukti (`/billing/proofs`)<br>6. Komplain (`/complaints`)<br>7. Laporan (`/reports`)<br>8. Pengaturan (`/settings`) | `src/components/layout/dashboard-shell.tsx`<br>`src/components/layout/dashboard-sidebar.tsx` (L23–L80) |

---

## 2. Analisis Perbedaan: Worksheet 8 vs Implementasi Eksisting Ngekost

1. **Ketiadaan Fitur Massal & Duplikat pada Basis Kode Nyata**:
   - Di Ngekost saat ini, pengelola hanya memiliki tombol `+ Tambah Kamar` tunggal berbasis modal dialog.
   - Sesuai temuan Worksheet 8 (responden R1, R2, R3), hal ini memaksa pengelola menginput kamar satu per satu berulang kali atau menyalin baris manual. Oleh karena itu, perancangan fitur **Tambah Kamar Massal** dan **Duplikat Kamar** sangat mendesak dan relevan untuk memecahkan beban operasional pengelola.
2. **Kesesuaian Field Form**:
   - Model data Ngekost memiliki field: `roomNumber`, `floor`, `type`, `priceMonthly`, `facilities`, `notes`.
   - Form Tambah Kamar Massal yang dirancang akan mengadopsi field asli ini ditambah parameter generator massal: `jumlahKamar`, `awalanNomor` (prefix), `nomorMulai` (start number), serta kalkulasi nomor akhir otomatis.
3. **Pesan Validasi**:
   - Pesan validasi error nomor kembar dari Ngekost (`Nomor kamar "..." sudah dipakai di properti ini. Gunakan nomor lain.`) diadopsi secara presisi ke dalam rancangan State Error wireframe dan prototype.
