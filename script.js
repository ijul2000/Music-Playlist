document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.getElementById('sidebar');
  var toggleBtn = document.getElementById('toggleBtn');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
  });
});
