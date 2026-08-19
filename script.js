(function () {
  "use strict";

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const TOTAL_SECONDS = 234; // 3:54
  let currentSeconds = 88;   // 1:28
  let isPlaying = true;
  let isDragging = false;
  let tickTimer = null;

  /* ------------------------------------------------------------
     ELEMENTS
     ------------------------------------------------------------ */
  const clockEl = document.getElementById("clock");
  const playBtn = document.getElementById("playBtn");
  const iconPlay = document.getElementById("iconPlay");
  const iconPause = document.getElementById("iconPause");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const likeBtn = document.getElementById("likeBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const repeatBtn = document.getElementById("repeatBtn");
  const progressTrack = document.getElementById("progressTrack");
  const progressFill = document.getElementById("progressFill");
  const progressThumb = document.getElementById("progressThumb");
  const timeCurrentEl = document.getElementById("timeCurrent");
  const timeTotalEl = document.getElementById("timeTotal");
  const tabButtons = document.querySelectorAll(".tab-btn");

  /* ------------------------------------------------------------
     HELPERS
     ------------------------------------------------------------ */
  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  function renderProgress() {
    const pct = Math.min(100, Math.max(0, (currentSeconds / TOTAL_SECONDS) * 100));
    progressFill.style.width = pct + "%";
    progressThumb.style.left = pct + "%";
    timeCurrentEl.textContent = formatTime(currentSeconds);
    timeTotalEl.textContent = formatTime(TOTAL_SECONDS);
  }

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    clockEl.textContent = h + ":" + m + " " + ampm;
  }

  /* ------------------------------------------------------------
     PLAY / PAUSE
     ------------------------------------------------------------ */
  function setPlaying(playing) {
    isPlaying = playing;
    playBtn.setAttribute("aria-pressed", String(playing));
    iconPlay.style.display = playing ? "none" : "block";
    iconPause.style.display = playing ? "block" : "none";

    if (playing) {
      startTicking();
    } else {
      stopTicking();
    }
  }

  function startTicking() {
    stopTicking();
    tickTimer = setInterval(() => {
      currentSeconds += 1;
      if (currentSeconds >= TOTAL_SECONDS) {
        currentSeconds = 0; // loop back to start, like a repeated track
      }
      renderProgress();
    }, 1000);
  }

  function stopTicking() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  playBtn.addEventListener("click", () => setPlaying(!isPlaying));

  /* ------------------------------------------------------------
     PREV / NEXT (visual feedback only — hook up a real queue here)
     ------------------------------------------------------------ */
  function bump(el) {
    el.style.transform = "scale(0.85)";
    setTimeout(() => { el.style.transform = ""; }, 120);
  }
  prevBtn.addEventListener("click", () => {
    bump(prevBtn);
    currentSeconds = 0;
    renderProgress();
  });
  nextBtn.addEventListener("click", () => {
    bump(nextBtn);
    currentSeconds = 0;
    renderProgress();
  });

  /* ------------------------------------------------------------
     LIKE / SHUFFLE / REPEAT TOGGLES
     ------------------------------------------------------------ */
  function toggleAriaPressed(btn) {
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!pressed));
  }
  likeBtn.addEventListener("click", () => toggleAriaPressed(likeBtn));
  shuffleBtn.addEventListener("click", () => toggleAriaPressed(shuffleBtn));
  repeatBtn.addEventListener("click", () => toggleAriaPressed(repeatBtn));

  /* ------------------------------------------------------------
     TAB BAR
     ------------------------------------------------------------ */
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("tab-btn--active"));
      btn.classList.add("tab-btn--active");
    });
  });

  /* ------------------------------------------------------------
     PROGRESS BAR — CLICK & DRAG
     ------------------------------------------------------------ */
  function seekFromClientX(clientX) {
    const rect = progressTrack.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.min(1, Math.max(0, ratio));
    currentSeconds = ratio * TOTAL_SECONDS;
    renderProgress();
  }

  progressTrack.addEventListener("pointerdown", (e) => {
    isDragging = true;
    progressTrack.setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  });
  progressTrack.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    seekFromClientX(e.clientX);
  });
  progressTrack.addEventListener("pointerup", (e) => {
    isDragging = false;
    progressTrack.releasePointerCapture(e.pointerId);
  });
  progressTrack.addEventListener("pointercancel", () => { isDragging = false; });

  /* ------------------------------------------------------------
     INIT
     ------------------------------------------------------------ */
  renderProgress();
  updateClock();
  setInterval(updateClock, 15000);
  setPlaying(true);
})();
