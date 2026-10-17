function updateTimeAndDate() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    let amPm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    let timeStr = hours.toString().padStart(2, '0') + minutes;
    if (timeStr.startsWith('0')) {
        timeStr = ' ' + timeStr.slice(1);
    }
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    if (month.startsWith('0')) {
        month = ' ' + month.slice(1);
    }
    if (day.startsWith('0')) {
        day = ' ' + day.slice(1);
    }
    const displayStr = timeStr + amPm + month + day + year;
    for (let i = 0; i < 12; i++) {
        document.getElementById('char' + i + '1').textContent = displayStr[i];
        document.getElementById('char' + i + '2').textContent = displayStr[i];
    }
}
updateTimeAndDate();
setInterval(updateTimeAndDate, 60000);


// Smooth 3D tilt and touch feedback for the Tube Clock.
// Uses Pointer Events + requestAnimationFrame to keep updates lightweight.
const clockSurface = document.querySelector('.clock');
if (clockSurface) {
  let rafId = 0;
  let resetTimer = 0;
  let lastX = 0;
  let lastY = 0;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function applyTilt(clientX, clientY, touch = false) {
    const rect = clockSurface.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));
    lastX = nx; lastY = ny;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const maxX = touch ? 4.5 : 5.5;
      const maxY = touch ? 6 : 7;
      clockSurface.style.setProperty('--clock-tilt-x', `${(-ny * maxX).toFixed(2)}deg`);
      clockSurface.style.setProperty('--clock-tilt-y', `${(nx * maxY).toFixed(2)}deg`);
      clockSurface.style.setProperty('--clock-glint-x', `${((nx + 1) * 50).toFixed(1)}%`);
      clockSurface.style.setProperty('--clock-glint-y', `${((ny + 1) * 50).toFixed(1)}%`);
      clockSurface.classList.add('clock-reacting');
    });
  }

  function resetTilt(delay = 100) {
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      clockSurface.style.setProperty('--clock-tilt-x', '0deg');
      clockSurface.style.setProperty('--clock-tilt-y', '0deg');
      clockSurface.style.setProperty('--clock-tilt-scale', '1');
      clockSurface.style.setProperty('--clock-glint-opacity', '0');
      clockSurface.classList.remove('clock-reacting');
    }, delay);
  }

  clockSurface.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse' && !finePointer) return;
    applyTilt(event.clientX, event.clientY, event.pointerType !== 'mouse');
  }, { passive: true });

  clockSurface.addEventListener('pointerdown', (event) => {
    applyTilt(event.clientX, event.clientY, event.pointerType !== 'mouse');
    clockSurface.classList.add('clock-reacting');
    resetTilt(750);
  }, { passive: true });

  clockSurface.addEventListener('pointerup', () => resetTilt(420), { passive: true });
  clockSurface.addEventListener('pointercancel', () => resetTilt(120), { passive: true });
  clockSurface.addEventListener('pointerleave', () => resetTilt(140), { passive: true });
}
