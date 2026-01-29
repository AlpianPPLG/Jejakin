# Cara Import Flowchart XML ke Draw.io

## 📋 Ringkasan
File XML flowchart yang telah dibuat dapat langsung diimport ke draw.io untuk menampilkan diagram alur secara visual.

## 🎯 File yang Tersedia
- ✅ `user.xml` - Flowchart alur User (Wisatawan) - **READY**
- ✅ `partner.xml` - Flowchart alur Partner (Pengelola Destinasi) - **READY**
- ⏳ `admin.xml` - Flowchart alur Admin (Administrator Platform) - Coming Soon

## 📖 Dokumentasi Lengkap
- `USER_FLOW_SUMMARY.md` - Dokumentasi detail alur User
- `PARTNER_FLOW_SUMMARY.md` - Dokumentasi detail alur Partner

---

## 📝 Langkah-langkah Import ke Draw.io

### Metode 1: Import via Web (draw.io)

1. **Buka Draw.io**
   - Kunjungi: https://app.diagrams.net/
   - Atau: https://draw.io/

2. **Import File XML**
   - Klik menu **File** → **Open from** → **Device**
   - Pilih file `user.xml` (atau partner.xml / admin.xml)
   - Klik **Open**

3. **Flowchart Otomatis Terbentuk**
   - Diagram akan langsung muncul dengan semua node dan koneksi
   - Anda bisa langsung edit, zoom, atau export

### Metode 2: Import via Desktop App

1. **Download Draw.io Desktop**
   - Download dari: https://github.com/jgraph/drawio-desktop/releases
   - Install aplikasi sesuai OS Anda (Windows/Mac/Linux)

2. **Buka File XML**
   - Buka aplikasi Draw.io Desktop
   - Klik **File** → **Open**
   - Pilih file `user.xml`
   - Flowchart langsung terbuka

### Metode 3: Drag & Drop (Tercepat)

1. **Buka Draw.io di Browser**
   - Kunjungi: https://app.diagrams.net/

2. **Drag & Drop File**
   - Drag file `user.xml` dari folder
   - Drop ke window browser draw.io
   - Flowchart langsung muncul

---

## 🎨 Fitur Flowchart User

### Alur Utama:
1. **Landing Page** → User pertama kali masuk
2. **Authentication** → Login/Register dengan pilihan role
3. **Dashboard** → Pusat kontrol user
4. **Explore Destinasi** → Browse dan search destinasi
5. **Destination Detail** → Lihat detail lengkap destinasi
6. **Booking Process** → Proses pemesanan tiket
7. **Payment** → Pembayaran booking
8. **Review** → Tulis review setelah kunjungan

### Fitur Tambahan:
- **Wishlist** → Simpan destinasi favorit
- **My Bookings** → Kelola semua booking
- **Notifications** → Notifikasi real-time
- **Cancel Booking** → Batalkan booking (jika pending)

---

## 🎨 Kustomisasi Flowchart

### Edit Node/Shape:
1. Klik node yang ingin diedit
2. Edit text langsung di node
3. Ubah warna via **Style** panel (kanan)

### Tambah Node Baru:
1. Drag shape dari panel kiri
2. Letakkan di canvas
3. Hubungkan dengan arrow

### Edit Koneksi/Arrow:
1. Klik arrow/edge
2. Edit label di text box
3. Ubah style (solid/dashed) via **Style** panel

### Ubah Layout:
1. Pilih semua node (Ctrl+A)
2. Klik **Arrange** → **Layout** → **Vertical Flow** atau **Horizontal Flow**

---

## 💾 Export Flowchart

### Export sebagai Gambar:
1. Klik **File** → **Export as** → **PNG** / **JPEG** / **SVG**
2. Atur kualitas dan ukuran
3. Klik **Export**

### Export sebagai PDF:
1. Klik **File** → **Export as** → **PDF**
2. Atur orientasi (Portrait/Landscape)
3. Klik **Export**

### Save sebagai XML (untuk edit lagi):
1. Klik **File** → **Save as**
2. Pilih lokasi penyimpanan
3. File akan tersimpan dalam format `.drawio` atau `.xml`

---

## 🎨 Legend (Keterangan Warna)

Flowchart menggunakan color coding untuk memudahkan pemahaman:

| Warna | Jenis | Keterangan |
|-------|-------|------------|
| 🟢 Hijau | Start/End & API Call | Titik awal/akhir & Panggilan API |
| 🔵 Biru | Page/View | Halaman atau tampilan UI |
| 🟡 Kuning | Decision & Menu | Keputusan atau pilihan menu |
| 🟠 Orange | Form Input | Input form dari user |
| 🟣 Ungu | Action/Process | Aksi atau proses sistem |
| 🔴 Merah | Error/Cancel | Error atau pembatalan |

---

## 📊 Tips Menggunakan Flowchart

### Untuk Developer:
- Gunakan sebagai **referensi implementasi** fitur
- Identifikasi **API endpoints** yang dibutuhkan
- Pahami **flow data** antar komponen

### Untuk Designer:
- Gunakan sebagai **wireframe** awal
- Identifikasi **user journey** yang perlu dioptimasi
- Desain **UI/UX** berdasarkan flow

### Untuk Project Manager:
- Gunakan untuk **dokumentasi** project
- Identifikasi **scope** dan **milestone**
- Komunikasi dengan **stakeholder**

---

## 🔧 Troubleshooting

### File tidak bisa dibuka?
- Pastikan file `user.xml` tidak corrupt
- Coba buka dengan text editor, pastikan format XML valid
- Gunakan draw.io versi terbaru

### Flowchart terlalu besar?
- Gunakan **Zoom** (Ctrl + Mouse Wheel)
- Klik **View** → **Fit Page** untuk auto-fit
- Export sebagai **SVG** untuk kualitas terbaik

### Ingin edit tapi takut rusak?
- Buat **backup** file XML terlebih dahulu
- Atau **Save As** dengan nama berbeda sebelum edit

---

## 📚 Resources

- **Draw.io Documentation**: https://www.diagrams.net/doc/
- **Draw.io Tutorials**: https://www.youtube.com/c/drawio
- **Keyboard Shortcuts**: https://www.diagrams.net/shortcuts

---

## ✅ Checklist Penggunaan

- [ ] Download/buka file `user.xml`
- [ ] Import ke draw.io (web atau desktop)
- [ ] Pahami alur dari START hingga END
- [ ] Identifikasi fitur yang perlu diimplementasi
- [ ] Kustomisasi sesuai kebutuhan project
- [ ] Export untuk dokumentasi atau presentasi

---

**Selamat menggunakan flowchart! 🎉**

Jika ada pertanyaan atau butuh modifikasi flowchart, silakan hubungi tim development.
