document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const pageLabel = document.getElementById('page-label');

  const pageNames = {
    home: 'Home',
    library: 'Library',
    admin: 'Admin'
  };

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const page = btn.getAttribute('data-page');
      if (pageLabel) {
        pageLabel.textContent = pageNames[page] || page;
      }
    });
  });
});
