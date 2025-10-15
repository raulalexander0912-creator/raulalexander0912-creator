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

    // --- Botón Revisar ---
    document.getElementById('btnReview').addEventListener('click', () => {
      const wrong = []; // lista de incorrectos
      // recorre cada elemento colocado
      state.forEach((place, sym) => {
        if (place === 'pool') return; // ignorar si está en pool
        // determina familia correcta
        const correctFamily = Object.keys(FAMILIES).find(f => FAMILIES[f].includes(sym));
        if (place !== correctFamily) { // si no coincide
          wrong.push(sym); // agrega a incorrectos
        }
      });

      if (wrong.length === 0) { // todos correctos
        showMessage('¡Excelente! Todos los elementos están en la familia correcta.');
      } else {
        showMessage(`Incorrectos: ${wrong.join(', ')}. Se reinician los colocados y se revuelven.`);
        // Quita todos los elementos colocados (no en pool) y revuelve
        resetPlaced(); // reubica al pool
        shufflePool(); // mezcla nuevamente
      }
    });

    // --- Botón Reiniciar ---
    document.getElementById('btnReset').addEventListener('click', () => {
      showMessage('Reinicio: elementos devueltos al pool y revueltos.');
      resetPlaced(); // reubica al pool
      shufflePool(); // mezcla
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
    initPool(); // inicializa elementos