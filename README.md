# 🎂 Birthday Website — Panduan Singkat

## Cara menjalankan
Buka `index.html` langsung di browser (double click), atau jalankan local server
(misalnya ekstensi "Live Server" di VS Code) untuk hasil terbaik.

## Cara memasukkan foto (langkah demi langkah)

1. Siapkan fotonya. Disarankan rasio **persegi (1:1)** untuk foto galeri polaroid, dan **4:3 (mendatar/landscape)** untuk foto photobooth, supaya tidak terpotong aneh. Kompres dulu kalau ukurannya besar (idealnya di bawah 500 KB per foto) biar website tetap ringan — bisa pakai situs seperti tinypng.com atau squoosh.app.
2. Ganti nama file fotomu persis seperti nama yang dipakai website:
   - Galeri polaroid (4 foto): `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`
   - Photobooth strip (6 foto): `photo5.jpg`, `photo6.jpg`, `photo7.jpg`, `photo8.jpg`, `photo9.jpg`, `photo10.jpg`
   - Kalau fotomu formatnya `.png` atau `.jpeg`, boleh — tinggal sesuaikan juga nama filenya di `js/script.js` (lihat tabel di bawah).
3. Taruh semua file foto itu ke dalam folder `images/` (folder ini sudah ada di dalam `birthday-website.zip`).
4. Buka kembali `index.html` di browser — foto otomatis muncul menggantikan placeholder gradient.

> Kalau mau pakai nama file atau jumlah foto yang beda dari default, tinggal ubah path-nya di `js/script.js` pada `CONFIG.photos` (galeri) dan `CONFIG.photobooth.strips` (photobooth) — ikuti pola path yang sudah ada, misalnya `'images/foto-kondangan.jpg'`.

## Yang perlu kamu ganti

| Apa | Di mana |
|---|---|
| Nama | `js/script.js` → `CONFIG.name` |
| Umur | `js/script.js` → `CONFIG.age` |
| Pesan ulang tahun | `index.html` → cari `id="birthday-message"` |
| Timeline kenangan | `index.html` → cari `<ol class="timeline-list">` |
| Foto galeri (polaroid) | Ganti file di folder `images/` dengan nama `photo1.jpg`–`photo4.jpg`, atau ubah path di `js/script.js` → `CONFIG.photos` dan di `index.html` bagian galeri |
| Foto photobooth (halaman "Photobooth Kenangan") | `js/script.js` → `CONFIG.photobooth.strips` — setiap array di dalamnya adalah satu strip foto (idealnya 3–4 foto). Tambah/hapus array untuk menambah/mengurangi jumlah strip. Taruh file fotonya di folder `images/` |
| Musik | Taruh file mp3 di `music/birthday.mp3` (atau ganti nama di `CONFIG.musicSrc`) |
| Warna tema | `css/style.css` → bagian `:root { ... }` di paling atas |

## Catatan
- Website ini sekarang menggunakan **navigasi antar halaman** (bukan scroll panjang): tiap section (Ucapan, Foto, Timeline, Kue, Rayakan) adalah satu halaman penuh yang berpindah lewat tombol panah ‹ › di bawah, titik indikator, geser (swipe) di HP, atau tombol panah kiri/kanan di keyboard.
- Jika foto belum kamu ganti, akan otomatis muncul placeholder gradient bertuliskan "Foto 1/2/3/4" — bukan gambar rusak.
- Jika file musik belum ada, tombol musik tetap muncul tapi tidak memutar apa pun sampai file-nya kamu tambahkan.
- Website ini sudah menghormati pengaturan "Reduce Motion" di sistem operasi/browser pengunjung.
- Semua animasi berat (fireworks, confetti, particle) sudah dibatasi jumlahnya khusus untuk mobile agar tetap ringan.
