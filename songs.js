/*
  songs.js — fail data lagu Prime Music.

  Anda boleh EDIT fail ini secara manual untuk tambah, ubah, atau
  padam lagu terus dalam kod, TANPA perlu guna panel Admin.

  Setiap lagu ialah satu objek dengan medan berikut:
    title  - tajuk lagu
    artist - nama artist
    year   - tahun keluaran (nombor)
    poster - link/URL imej poster/cover lagu
    audio  - link/URL fail audio lagu (mp3, dsb.)

  Contoh:
    {
      title: "Nama Lagu Anda",
      artist: "Nama Artist",
      year: 2024,
      poster: "https://contoh.com/poster.jpg",
      audio: "https://contoh.com/lagu.mp3"
    }

  Tambah objek baru dalam array PRIME_MUSIC_SONGS di bawah,
  dipisahkan dengan koma. Tak perlu isi "id" — sistem akan
  urus sendiri. Panel Admin di laman web akan guna senarai
  ini sebagai data permulaan.
*/

const PRIME_MUSIC_SONGS = [
  {
    title: "Contoh Lagu",
    artist: "Contoh Artist",
    year: 2024,
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audio: "https://example.com/contoh-lagu.mp3"
  }
];
