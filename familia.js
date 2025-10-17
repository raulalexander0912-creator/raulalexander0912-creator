// --- Datos de elementos por familia ---
    const FAMILIES = { // objeto con arrays por familia
      metales: [
        'Na','K', // alcalinos
        'Mg','Ca','Ba', // alcalinotérreos
        'Mn','Fe','Co','Ni','Cu','Zn', // transición (parcial)
        'Pd','Ag','Cd', // transición (parcial 2)
        'Pt','Au','Hg','Cr','Pb','Al','Sn' // transición (parcial 3)
      ],
      nometales: ['H','C','N','O','F','P','S','Cl','Se','Br','I'],
      metaloides: ['B','Si','As','Sb'],
      gasesnobles: ['He','Ne','Ar','Kr'],
      tierrasraras: [
        'Pu'
        ]
    };

    // --- Conjunto total de elementos iniciales (mezclados) ---
    const ALL = [
      ...FAMILIES.metales.slice(0,14), // recorte para dificultad razonable
      ...FAMILIES.nometales.slice(0,6),
      ...FAMILIES.metaloides,
      ...FAMILIES.gasesnobles.slice(0, 4), // recorte
      ...FAMILIES.tierrasraras.slice(0, 1) // recorte
    ];

    // --- Estado: ubicación de cada elemento ---
    const state = new Map(); // elemento -> contenedor id

    // --- Inicializa pool con elementos mezclados ---
    function initPool() {
      const pool = document.getElementById('pool'); // contenedor pool
      pool.innerHTML = ''; // limpia
      const mixed = window.AppHelpers.shuffle([...ALL]); // mezcla copia
      mixed.forEach(sym => { // por cada símbolo
        const el = document.createElement('div'); // crea div
        el.className = 'item'; // clase item
        el.draggable = true; // habilita arrastre
        el.textContent = sym; // texto del símbolo
        el.dataset.element = sym; // guarda nombre
        // eventos de drag
        el.addEventListener('dragstart', onDragStart); // inicio arrastre
        pool.appendChild(el); // agrega al pool
        state.set(sym, 'pool'); // estado inicial en pool
      });
      showMessage('Arrastra cada elemento a su familia correspondiente.'); // mensaje
    }

    // --- Eventos drag & drop ---
    function onDragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.dataset.element); // pasa símbolo
    }

    document.querySelectorAll('.drop').forEach(drop => { // cada zona familia
      drop.addEventListener('dragover', e => { e.preventDefault(); }); // permite soltar
      drop.addEventListener('drop', e => { // al soltar
        e.preventDefault(); // evita comportamiento por defecto
        const sym = e.dataTransfer.getData('text/plain'); // obtiene símbolo
        const item = document.querySelector(`.item[data-element="${sym}"]`); // busca tarjeta
        if (item) { // si existe
          drop.appendChild(item); // mover al drop
          state.set(sym, drop.dataset.family); // actualiza estado
          // cambia color del texto al color del fondo del grupo
          const cs = getComputedStyle(drop); // estilos del drop
          item.style.color = cs.color; // usa color de texto del drop
        }
      });
    });

    // Permitir retornar al pool
    const pool = document.getElementById('pool'); // referencia pool
    pool.addEventListener('dragover', e => { e.preventDefault(); }); // permite soltar
    pool.addEventListener('drop', e => { // al soltar sobre pool
      e.preventDefault();
      const sym = e.dataTransfer.getData('text/plain'); // símbolo
      const item = document.querySelector(`.item[data-element="${sym}"]`); // tarjeta
      if (item) {
        pool.appendChild(item); // devuelve al pool
        state.set(sym, 'pool'); // actualiza estado
        item.style.color = '#222'; // color texto por defecto
      }
    });

document.getElementById('btnReview').addEventListener('click', () => {
  clearInterval(timer); // ⏹️ Detiene el temporizador

  const correct = [];
  const wrong = [];

  state.forEach((place, sym) => {
    if (place === 'pool') return;
    const correctFamily = Object.keys(FAMILIES).find(f => FAMILIES[f].includes(sym));
    if (place === correctFamily) {
      correct.push(sym);
    } else {
      wrong.push(sym);
    }
  });

  const reviewBox = document.getElementById('reviewBox');
  reviewBox.style.display = 'block';

  if (wrong.length === 0) {
    reviewBox.innerHTML = `
      <strong>¡Excelente!</strong><br>
      Todos los elementos están en la familia correcta: ${correct.join(', ')}<br><br>
      <button id="btnContinue" class="btn" style="margin-top:0.5rem;">Continuar</button>
    `;
  } else {
    reviewBox.innerHTML = `
      <strong>Revisión completada</strong><br>
      ✅ Correctos: ${correct.length ? correct.join(', ') : 'Ninguno'}<br>
      ❌ Incorrectos: ${wrong.length ? wrong.join(', ') : 'Ninguno'}<br><br>
      <button id="btnContinue" class="btn" style="margin-top:0.5rem;">Continuar</button>
    `;
  }

  // Asignar evento al botón "Continuar"
  setTimeout(() => {
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.onclick = () => {
      reviewBox.style.display = 'none';
      resetPlaced();      // Devuelve elementos al pool
      shufflePool();      // Mezcla el pool
      startTimer();       // Reinicia el temporizador
      showMessage('Juego reiniciado. ¡Clasifica los elementos nuevamente!');
    };
  }, 50);
});

    // --- Botón Reiniciar ---
  document.getElementById('btnReset').addEventListener('click', () => {
   showMessage('Reinicio: elementos devueltos al pool y revueltos.');
   document.getElementById('reviewBox').style.display = 'none';
   resetPlaced();
   shufflePool();
    startTimer();
  });


    // --- Helpers de UI ---
    function showMessage(text) { // muestra mensaje en la UI
      const msg = document.getElementById('msg'); // contenedor mensaje
      msg.textContent = text; // asigna texto
    }

    function resetPlaced() { // devuelve elementos colocados al pool
      const pool = document.getElementById('pool'); // contenedor pool
      document.querySelectorAll('.item').forEach(item => { // cada tarjeta
        pool.appendChild(item); // mueve al pool
        state.set(item.dataset.element, 'pool'); // estado en pool
        item.style.color = '#222'; // color texto por defecto
      });
    }

    function shufflePool() { // mezcla el orden visual del pool
      const pool = document.getElementById('pool'); // contenedor
      const items = Array.from(pool.children); // hijos actuales
      const mixed = window.AppHelpers.shuffle(items); // mezcla nodos
      mixed.forEach(n => pool.appendChild(n)); // reordena en DOM
    }

    // --- Inicio ---
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

function showGameOver(correct = [], wrong = []) {
  clearInterval(timer); // ⏹️ Detiene el temporizador

  const reviewBox = document.getElementById('reviewBox');
  reviewBox.style.display = 'block';
  reviewBox.innerHTML = `
    <strong>Revisión completada</strong><br>
    ⏱ Tiempo agotado o revisión fallida.<br>
    ✅ Correctos: ${correct.length ? correct.join(', ') : 'Ninguno'}<br>
    ❌ Incorrectos: ${wrong.length ? wrong.join(', ') : 'Ninguno'}<br><br>
    <button id="btnContinue" class="btn" style="margin-top:0.5rem;">Continuar</button>
  `;

  setTimeout(() => {
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.onclick = () => {
      reviewBox.style.display = 'none';       // Oculta el cuadro
      resetPlaced();                          // Devuelve elementos al pool
      shufflePool();                          // Mezcla el pool
      startTimer();                           // Reinicia el temporizador
      showMessage('Juego reiniciado. ¡Clasifica los elementos nuevamente!');
    };
  }, 50);
}

document.getElementById('btnContinue').addEventListener('click', () => {
  const modal = document.getElementById('gameOverModal');
  if (modal) {
    modal.style.display = 'none';
  }
  initPool();
  startTimer();
});

// --- Iniciar juego ---
initPool(); // inicializa elementos
startTimer();
