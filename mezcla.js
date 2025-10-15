    // --- Datos: conjuntos de tarjetas ---
    const MIXES = [ // mezclas comunes
      { id: 'agua_sal', label: 'Agua con sal' },
      { id: 'arena_agua', label: 'Arena y agua' },
      { id: 'aire', label: 'Aire' },
      { id: 'petroleo', label: 'Petróleo crudo' }
    ];

    const COMPONENTS = [ // componentes correspondientes
      { id: 'agua_sal_c', label: 'Agua + sal (NaCl)' },
      { id: 'arena_agua_c', label: 'Arena + agua' },
      { id: 'aire_c', label: 'N₂, O₂, CO₂, Ar...' },
      { id: 'petroleo_c', label: 'Hidrocarburos variados' }
    ];

    const METHODS = [ // métodos de separación correctos
      { id: 'agua_sal_m', label: 'Evaporación / Destilación' },
      { id: 'arena_agua_m', label: 'Filtración / Decantación' },
      { id: 'aire_m', label: 'Destilación fraccionada criogénica' },
      { id: 'petroleo_m', label: 'Destilación fraccionada' }
    ];

    const TYPES = [ // tipo de mezcla
      { id: 'agua_sal_t', label: 'Homogénea (solución)' },
      { id: 'arena_agua_t', label: 'Heterogénea' },
      { id: 'aire_t', label: 'Homogénea (mezcla gaseosa)' },
      { id: 'petroleo_t', label: 'Heterogénea / Compleja' }
    ];

    // --- Relación de correctos: id base -> ids en cada categoría ---
    const MIX_MAP = {
      agua_sal: { comp: 'agua_sal_c', method: 'agua_sal_m', type: 'agua_sal_t' },
      arena_agua: { comp: 'arena_agua_c', method: 'arena_agua_m', type: 'arena_agua_t' },
      aire: { comp: 'aire_c', method: 'aire_m', type: 'aire_t' },
      petroleo: { comp: 'petroleo_c', method: 'petroleo_m', type: 'petroleo_t' }
    };

    // --- Estado: ubicación de cada tarjeta ---
    const state = new Map(); // id -> zona ('pool','mix','components','method','type')

    // --- Inicialización del pool ---
    function renderTags() {
      const pool = document.getElementById('tagsPool'); // contenedor pool
      pool.innerHTML = ''; // limpia

      // Crea tarjetas de todas las categorías
      const all = [
        ...MIXES.map(x => ({...x, kind: 'mix'})),
        ...COMPONENTS.map(x => ({...x, kind: 'components'})),
        ...METHODS.map(x => ({...x, kind: 'method'})),
        ...TYPES.map(x => ({...x, kind: 'type'}))
      ];

      // Mezcla aleatoriamente
      window.AppHelpers.shuffle(all).forEach(t => { // por cada tarjeta
        const tag = document.createElement('div'); // crea div
        tag.className = 'tag'; // clase tarjeta
        tag.draggable = true; // arrastrable
        tag.textContent = t.label; // texto
        tag.dataset.id = t.id; // id
        tag.dataset.kind = t.kind; // tipo categoría
        tag.addEventListener('dragstart', e => { // inicio drag
          e.dataTransfer.setData('text/plain', t.id); // pasa id
        });
        pool.appendChild(tag); // agrega al pool
        state.set(t.id, 'pool'); // estado inicial
      });
    }

    // --- Configura dropzones ---
    document.querySelectorAll('.dropzone').forEach(zone => { // cada zona
      zone.addEventListener('dragover', e => { e.preventDefault(); }); // permite soltar
      zone.addEventListener('drop', e => { // al soltar
        e.preventDefault(); // evita por defecto
        const id = e.dataTransfer.getData('text/plain'); // id tarjeta
        const tag = document.querySelector(`.tag[data-id="${id}"]`); // busca tag
        if (!tag) return; // si no existe, salir

        const zoneType = zone.id.includes('mix') ? 'mix' :
                         zone.id.includes('comp') ? 'components' :
                         zone.id.includes('method') ? 'method' : 'type'; // deduce tipo zona

        // Regla: solo puede colocarse tarjeta del tipo correcto en cada bloque
        if (tag.dataset.kind !== zoneType) { // si tipo no coincide
          // feedback simple
          document.getElementById('mMsg').textContent = 'Esa tarjeta no pertenece a este bloque.';
          return; // no colocar
        }

        zone.appendChild(tag); // coloca la tarjeta
        state.set(id, zoneType); // actualiza estado
      });
    });

    // --- Permitir devolver al pool ---
    const tagsPool = document.getElementById('tagsPool'); // referencia pool
    tagsPool.addEventListener('dragover', e => { e.preventDefault(); }); // permite soltar
    tagsPool.addEventListener('drop', e => { // al soltar en pool
      e.preventDefault(); // evita por defecto
      const id = e.dataTransfer.getData('text/plain'); // id tarjeta
      const tag = document.querySelector(`.tag[data-id="${id}"]`); // busca
      if (!tag) return; // no existe
      tagsPool.appendChild(tag); // devuelve al pool
      state.set(id, 'pool'); // estado
    });

    // --- Revisar ---
    document.getElementById('btnMReview').addEventListener('click', () => {
      const wrong = []; // tarjetas mal ubicadas o faltantes

      // Verifica que cada mezcla tenga sus tres tarjetas correctas en los bloques correspondientes
      Object.keys(MIX_MAP).forEach(mixId => { // por cada mezcla base
        const compId = MIX_MAP[mixId].comp; // componente id
        const methodId = MIX_MAP[mixId].method; // método id
        const typeId = MIX_MAP[mixId].type; // tipo id

        const okMix = state.get(mixId) === 'mix'; // mezcla en bloque mezcla
        const okComp = state.get(compId) === 'components'; // componente en bloque componentes
        const okMethod = state.get(methodId) === 'method'; // método en bloque método
        const okType = state.get(typeId) === 'type'; // tipo en bloque tipo

        if (!(okMix && okComp && okMethod && okType)) { // si falla cualquiera
          wrong.push(mixId); // agrega mezcla incorrecta
        }
      });

      const msg = document.getElementById('mMsg'); // mensaje
      if (wrong.length === 0) { // todo correcto
        msg.textContent = '¡Excelente! Todas las mezclas están correctamente organizadas.';
      } else {
        msg.textContent = `Incorrectas: ${wrong.join(', ')}. Se devuelve todo al pool y se baraja.`;
        resetAll(); // resetea
        renderTags(); // re-render mezclado
      }
    });

    // --- Reiniciar ---
    document.getElementById('btnMReset').addEventListener('click', () => {
      const msg = document.getElementById('mMsg'); // mensaje
      msg.textContent = 'Reinicio: todas las tarjetas se devolvieron al pool y se barajaron.';
      resetAll(); // reset
      renderTags(); // re-render
    });

    // --- Helper: resetear todo ---
    function resetAll() {
      document.querySelectorAll('.tag').forEach(tag => { // cada tarjeta
        tagsPool.appendChild(tag); // devuelve al pool
        state.set(tag.dataset.id, 'pool'); // estado pool
      });
      // limpia zonas
      document.getElementById('mixZone').innerHTML = '';
      document.getElementById('compZone').innerHTML = '';
      document.getElementById('methodZone').innerHTML = '';
      document.getElementById('typeZone').innerHTML = '';
    }

    // --- Inicio ---
    renderTags(); // inicializa tarjetas