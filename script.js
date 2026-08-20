document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const pageTitle = document.getElementById('page-title');
  const pageLabel = document.getElementById('page-label');

  const pageCopy = {
    home: {
      title: 'Selamat datang',
      label: 'Ruang ini masih kosong — mula tambah lagu kegemaran anda.'
    },
    library: {
      title: 'Library anda',
      label: 'Belum ada playlist atau album disimpan lagi.'
    },
    admin: {
      title: 'Panel admin',
      label: 'Urus kandungan dan tetapan platform di sini.'
    }
  };

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const page = btn.getAttribute('data-page');
      const copy = pageCopy[page];
      if (copy) {
        if (pageTitle) pageTitle.textContent = copy.title;
        if (pageLabel) pageLabel.textContent = copy.label;
      }
    });
  });
});
