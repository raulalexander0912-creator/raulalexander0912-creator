// --- Datos: compuestos inorgánicos y correspondencias ---
const COMPOUNDS = [
  { id: 'acido_clorhidrico', label: 'Ácido clorhídrico' },
  { id: 'sulfato_sodio', label: 'Sulfato de sodio' },
  { id: 'nitrato_potasio', label: 'Nitrato de potasio' },
  { id: 'hidroxido_calcio', label: 'Hidróxido de calcio' },
  { id: 'oxido_magnesio', label: 'Óxido de magnesio' },
  { id: 'permanganato_potasio', label: 'Permanganato de potasio' }
];

const TARGETS = [
  { id: 'acido_clorhidrico_t', label: 'HCl → H, Cl' },
  { id: 'sulfato_sodio_t', label: 'Na₂SO₄ → Na, S, O' },
  { id: 'nitrato_potasio_t', label: 'KNO₃ → K, N, O' },
  { id: 'hidroxido_calcio_t', label: 'Ca(OH)₂ → Ca, O, H' },
  { id: 'oxido_magnesio_t', label: 'MgO → Mg, O' },
  { id: 'permanganato_potasio_t', label: 'KMnO₄ → K, Mn, O' }
];

const SOLUTIONS = {
  acido_clorhidrico: 'acido_clorhidrico_t',
  sulfato_sodio: 'sulfato_sodio_t',
  nitrato_potasio: 'nitrato_potasio_t',
  hidroxido_calcio: 'hidroxido_calcio_t',
  oxido_magnesio: 'oxido_magnesio_t',
  permanganato_potasio: 'permanganato_potasio_t'
};

// --- Estado ---
const connections = [];
let activeLeft = null;

// --- Render columnas ---
function renderCols() {
  const leftCol = document.getElementById('leftCol');
  const rightCol = document.getElementById('rightCol');
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

  const L = window.AppHelpers.shuffle([...COMPOUNDS]);
  const R = window.AppHelpers.shuffle([...TARGETS]);

  L.forEach(item => {
    const div = document.createElement('div');
    div.className = 'choice';
    div.textContent = item.label;
    div.dataset.id = item.id;
    div.addEventListener('click', () => {
      document.querySelectorAll('.left .choice').forEach(c => c.classList.remove('active'));
      activeLeft = item.id;
      div.classList.add('active');
    });
    leftCol.appendChild(div);
  });

  R.forEach(item => {
    const div = document.createElement('div');
    div.className = 'choice';
    div.textContent = item.label;
    div.dataset.id = item.id;
    div.addEventListener('click', () => {
      if (!activeLeft) return;
      addConnection(activeLeft, item.id);
      activeLeft = null;
      document.querySelectorAll('.left .choice').forEach(c => c.classList.remove('active'));
    });
    rightCol.appendChild(div);
  });

  setTimeout(() => {redrawLines();}, 100); // Asegura que los elementos estén renderizados
}

// --- Agregar conexión ---
function addConnection(fromId, toId) {
  const exists = connections.find(c => c.from === fromId);
  if (exists) {
    exists.to = toId;
  } else {
    connections.push({ from: fromId, to: toId });
  }
  redrawLines();
}

// --- Dibujar líneas ---
function redrawLines() {
  const svg = document.getElementById('lines');
  const area = document.getElementById('matchArea');
  svg.innerHTML = '';

  connections.forEach(conn => {
    const leftEl = document.querySelector(`.left .choice[data-id="${conn.from}"]`);
    const rightEl = document.querySelector(`.right .choice[data-id="${conn.to}"]`);
    if (!leftEl || !rightEl) return;

    const aRect = leftEl.getBoundingClientRect();
    const bRect = rightEl.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();

    const x1 = aRect.right - areaRect.left;
    const y1 = aRect.top + aRect.height / 2 - areaRect.top;
    const x2 = bRect.left - areaRect.left;
    const y2 = bRect.top + bRect.height / 2 - areaRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#0d6efd');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  });
}

// --- Revisar ---
document.getElementById('btnCReview').addEventListener('click', () => {
  let wrong = [];
  let correct = 0;
  COMPOUNDS.forEach(c => {
    const found = connections.find(k => k.from === c.id);
    if (!found) {
      wrong.push(c.label + ' (sin conexión)');
    } else if (SOLUTIONS[c.id] !== found.to) {
      wrong.push(c.label);
    } else {
      correct++;
    }
  });

  const msg = document.getElementById('cMsg');
  if (wrong.length === 0 && correct === COMPOUNDS.length) {
    msg.textContent = '¡Muy bien! Todas las relaciones son correctas.';
  } else {
    msg.textContent = `Incorrectas: ${wrong.join(' | ')}. Se limpian líneas y se revuelven las columnas.`;
    connections.splice(0, connections.length);
    renderCols();
    startTimer(); // reinicia el temporizador
  }
});

// --- Reiniciar ---
document.getElementById('btnCReset').addEventListener('click', () => {
  const msg = document.getElementById('cMsg');
  msg.textContent = 'Reinicio: se limpiaron las conexiones y se revuelven las columnas.';
  connections.splice(0, connections.length);
  renderCols();

  // 🔁 Espera a que el DOM se estabilice antes de reiniciar el temporizador
  setTimeout(() => {
    startTimer();
  }, 50);
});

// --- Eventos de redibujo ---
window.addEventListener('resize', redrawLines);
window.addEventListener('scroll', redrawLines, true);

// --- Temporizador de 2 minutos ---
let timer;
let timeLeft = 120;

function startTimer() {
  clearInterval(timer);
  timeLeft = 120;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      showGameOver();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const display = document.getElementById('timerDisplay');
  if (display) {
    display.textContent = `Tiempo restante: ${formatted}`;
  }
}

function showGameOver() {
  const modal = document.getElementById('gameOverModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

document.getElementById('btnContinue').addEventListener('click', () => {
  const modal = document.getElementById('gameOverModal');
  if (modal) {
    modal.style.display = 'none';
  }
  connections.splice(0, connections.length);
  renderCols();
  startTimer();
});



// --- Iniciar juego ---
renderCols();
startTimer();