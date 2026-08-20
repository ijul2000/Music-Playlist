document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const songForm = document.getElementById('song-form');
  const formError = document.getElementById('form-error');
  const btnAddSong = document.getElementById('btn-add-song');
  const btnCancel = document.getElementById('btn-cancel');
  const btnDownload = document.getElementById('btn-download');

  const fTitle = document.getElementById('f-title');
  const fArtist = document.getElementById('f-artist');
  const fYear = document.getElementById('f-year');
  const fPoster = document.getElementById('f-poster');
  const fAudio = document.getElementById('f-audio');

  const libraryGrid = document.getElementById('library-grid');
  const libraryEmpty = document.getElementById('library-empty');
  const adminTbody = document.getElementById('admin-tbody');
  const adminEmpty = document.getElementById('admin-empty');

  let songs = loadSongs();
  let editingId = null;

  // ---------- Data ----------
  // songs.js ialah satu-satunya sumber data yang kekal (persistent).
  // Sebarang tambah/edit/padam melalui panel Admin hanya bertahan
  // untuk sesi semasa (dalam memori pelayar) — klik "Muat Turun
  // songs.js" untuk simpan perubahan itu secara kekal ke dalam fail.

  function loadSongs() {
    if (window.PRIME_MUSIC_SONGS && Array.isArray(window.PRIME_MUSIC_SONGS)) {
      return window.PRIME_MUSIC_SONGS.map((s) => ({ ...s, id: makeId() }));
    }
    return [];
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- Nav / view switching ----------

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const page = btn.getAttribute('data-page');
      views.forEach((v) => v.classList.remove('active'));
      const target = document.querySelector(`.view[data-view="${page}"]`);
      if (target) target.classList.add('active');

      if (page === 'library') renderLibrary();
      if (page === 'admin') renderAdmin();
    });
  });

  // ---------- Rendering ----------

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderLibrary() {
    if (!songs.length) {
      libraryGrid.classList.add('hidden');
      libraryEmpty.classList.add('show');
      libraryGrid.innerHTML = '';
      return;
    }
    libraryGrid.classList.remove('hidden');
    libraryEmpty.classList.remove('show');

    libraryGrid.innerHTML = songs.map((s) => `
      <div class="song-card">
        <img class="song-poster" src="${escapeHtml(s.poster)}" alt="${escapeHtml(s.title)}" loading="lazy" onerror="this.style.background='linear-gradient(135deg, rgba(155,92,255,0.18), rgba(75,255,165,0.1))'; this.removeAttribute('src');">
        <div class="song-name">${escapeHtml(s.title)}</div>
        <div class="song-meta">${escapeHtml(s.artist)} · ${escapeHtml(String(s.year))}</div>
      </div>
    `).join('');
  }

  function renderAdmin() {
    if (!songs.length) {
      document.getElementById('admin-table').style.display = 'none';
      adminEmpty.classList.add('show');
      adminTbody.innerHTML = '';
      return;
    }
    document.getElementById('admin-table').style.display = '';
    adminEmpty.classList.remove('show');

    adminTbody.innerHTML = songs.map((s) => `
      <tr data-id="${s.id}">
        <td><img class="table-poster" src="${escapeHtml(s.poster)}" alt="" loading="lazy" onerror="this.style.background='linear-gradient(135deg, rgba(155,92,255,0.18), rgba(75,255,165,0.1))'; this.removeAttribute('src');"></td>
        <td>${escapeHtml(s.title)}</td>
        <td class="cell-artist">${escapeHtml(s.artist)}</td>
        <td class="cell-year">${escapeHtml(String(s.year))}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" data-action="edit" data-id="${s.id}" title="Edit lagu" type="button">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            </button>
            <button class="btn-icon danger" data-action="delete" data-id="${s.id}" title="Padam lagu" type="button">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.7 12.1a2 2 0 0 1-2 1.9H8.7a2 2 0 0 1-2-1.9L6 7h12Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---------- Modal ----------

  function openModal(mode, song) {
    formError.textContent = '';
    songForm.reset();

    if (mode === 'edit' && song) {
      editingId = song.id;
      modalTitle.textContent = 'Edit Lagu';
      fTitle.value = song.title;
      fArtist.value = song.artist;
      fYear.value = song.year;
      fPoster.value = song.poster;
      fAudio.value = song.audio;
    } else {
      editingId = null;
      modalTitle.textContent = 'Tambah Lagu';
    }

    modalOverlay.classList.add('open');
    fTitle.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    editingId = null;
    songForm.reset();
    formError.textContent = '';
  }

  btnAddSong.addEventListener('click', () => openModal('add'));
  btnCancel.addEventListener('click', closeModal);

  btnDownload.addEventListener('click', () => {
    const body = songs.map((s) => `  {
    title: ${JSON.stringify(s.title)},
    artist: ${JSON.stringify(s.artist)},
    year: ${JSON.stringify(Number(s.year) || s.year)},
    poster: ${JSON.stringify(s.poster)},
    audio: ${JSON.stringify(s.audio)}
  }`).join(',\n');

    const fileContent = `/*
  songs.js — fail data lagu Prime Music.

  Anda boleh EDIT fail ini secara manual untuk tambah, ubah, atau
  padam lagu terus dalam kod, TANPA perlu guna panel Admin.

  Medan setiap lagu:
    title, artist, year, poster (URL imej), audio (URL lagu)

  Tak perlu isi "id" — sistem urus sendiri.

  Fail ini dijana dari panel Admin. Muat naik fail ini ke repo
  GitHub anda (gantikan songs.js sedia ada) supaya lagu kekal
  untuk semua pelawat, bukan setakat pelayar ini sahaja.
*/

const PRIME_MUSIC_SONGS = [
${body}
];
`;

    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'songs.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  songForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = fTitle.value.trim();
    const artist = fArtist.value.trim();
    const year = fYear.value.trim();
    const poster = fPoster.value.trim();
    const audio = fAudio.value.trim();

    if (!title || !artist || !year || !poster || !audio) {
      formError.textContent = 'Sila lengkapkan semua ruangan.';
      return;
    }

    if (editingId) {
      songs = songs.map((s) => s.id === editingId
        ? { ...s, title, artist, year, poster, audio }
        : s);
    } else {
      songs.push({
        id: makeId(),
        title, artist, year, poster, audio
      });
    }

    renderAdmin();
    renderLibrary();
    closeModal();
  });

  adminTbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    const song = songs.find((s) => s.id === id);
    if (!song) return;

    if (action === 'edit') {
      openModal('edit', song);
    } else if (action === 'delete') {
      const confirmed = window.confirm(`Padam lagu "${song.title}"?`);
      if (confirmed) {
        songs = songs.filter((s) => s.id !== id);
        renderAdmin();
        renderLibrary();
      }
    }
  });

  // ---------- Init ----------

  renderLibrary();
  renderAdmin();
});
