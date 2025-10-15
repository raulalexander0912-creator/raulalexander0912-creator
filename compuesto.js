    // --- Datos: compuestos y correspondencias ---
    const COMPOUNDS = [ // lista de compuestos (izquierda)
      { id: 'agua', label: 'Agua' },
      { id: 'sal', label: 'Sal' },
      { id: 'azucar', label: 'Azúcar' },
      { id: 'co2', label: 'Dióxido de carbono' },
      { id: 'etanol', label: 'Etanol' },
      { id: 'bicarbonato', label: 'Bicarbonato de sodio' }
    ];

    const TARGETS = [ // lista de objetivos (derecha)
      { id: 'agua_t', label: 'H₂O = H, O' },
      { id: 'sal_t', label: 'NaCl = Na, Cl' },
      { id: 'azucar_t', label: 'C₁₂H₂₂O₁₁ = C, H, O' },
      { id: 'co2_t', label: 'CO₂ = C, O' },
      { id: 'etanol_t', label: 'C₂H₆O = C, H, O' },
      { id: 'bicarbonato_t', label: 'NaHCO₃ = Na, H, C, O' }
    ];

    const SOLUTIONS = { // mapa de soluciones id izquierda -> id derecha
      agua: 'agua_t',
      sal: 'sal_t',
      azucar: 'azucar_t',
      co2: 'co2_t',
      etanol: 'etanol_t',
      bicarbonato: 'bicarbonato_t'
    };

    // --- Estado: selección y conexiones ---
    const connections = []; // pares {from, to}
    let activeLeft = null; // seleccionado en izquierda

    // --- Render de columnas ---
    function renderCols() {
      const leftCol = document.getElementById('leftCol'); // contenedor izquierda
      const rightCol = document.getElementById('rightCol'); // contenedor derecha
      leftCol.innerHTML = ''; // limpia
      rightCol.innerHTML = ''; // limpia
      // mezclar para no estar siempre igual
      const L = window.AppHelpers.shuffle([...COMPOUNDS]); // mezcla izquierda
      const R = window.AppHelpers.shuffle([...TARGETS]); // mezcla derecha

      L.forEach(item => { // render izquierda
        const div = document.createElement('div'); // crea div
        div.className = 'choice'; // clase ítem
        div.textContent = item.label; // texto
        div.dataset.id = item.id; // id
        div.addEventListener('click', () => { // al clic
          document.querySelectorAll('.left .choice').forEach(c => c.classList.remove('active')); // desactiva otros
          activeLeft = item.id; // guarda seleccionado
          div.classList.add('active'); // marca activo
        });
        leftCol.appendChild(div); // agrega
      });

      R.forEach(item => { // render derecha
        const div = document.createElement('div'); // crea div
        div.className = 'choice'; // clase
        div.textContent = item.label; // texto
        div.dataset.id = item.id; // id
        div.addEventListener('click', () => { // clic en derecha
          if (!activeLeft) return; // si no hay izquierda activa, no dibuja
          addConnection(activeLeft, item.id); // crea conexión
          activeLeft = null; // resetea selección izquierda
          document.querySelectorAll('.left .choice').forEach(c => c.classList.remove('active')); // desactiva
        });
        rightCol.appendChild(div); // agrega
      });

      redrawLines(); // dibuja líneas inicial (ninguna)
    }

    // --- Agregar conexión ---
    function addConnection(fromId, toId) {
      // Evita duplicados del mismo desde-id
      const exists = connections.find(c => c.from === fromId); // busca existente
      if (exists) { // si ya había
        exists.to = toId; // reemplaza destino
      } else {
        connections.push({ from: fromId, to: toId }); // agrega nuevo
      }
      redrawLines(); // actualiza líneas
    }

    // --- Dibujar líneas usando SVG superpuesto ---
    function redrawLines() {
      const svg = document.getElementById('lines'); // referencia SVG
      const area = document.getElementById('matchArea'); // contenedor
      svg.innerHTML = ''; // limpia líneas

      connections.forEach(conn => { // por cada conexión
        const leftEl = document.querySelector(`.left .choice[data-id="${conn.from}"]`); // origen
        const rightEl = document.querySelector(`.right .choice[data-id="${conn.to}"]`); // destino
        if (!leftEl || !rightEl) return; // si falta, no dibuja

        const aRect = leftEl.getBoundingClientRect(); // rect origen
        const bRect = rightEl.getBoundingClientRect(); // rect destino
        const areaRect = area.getBoundingClientRect(); // rect área (para coords relativas)

        const x1 = aRect.right - areaRect.left; // x origen
        const y1 = aRect.top + aRect.height/2 - areaRect.top; // y origen
        const x2 = bRect.left - areaRect.left; // x destino
        const y2 = bRect.top + bRect.height/2 - areaRect.top; // y destino

        const line = document.createElementNS('http://www.w3.org/2000/svg','line'); // crea línea
        line.setAttribute('x1', x1); // coord x1
        line.setAttribute('y1', y1); // coord y1
        line.setAttribute('x2', x2); // coord x2
        line.setAttribute('y2', y2); // coord y2
        line.setAttribute('stroke', '#0d6efd'); // color línea
        line.setAttribute('stroke-width', '2'); // grosor
        svg.appendChild(line); // agrega al SVG
      });
    }

    // --- Revisar ---
    document.getElementById('btnCReview').addEventListener('click', () => {
      let wrong = []; // lista de incorrectas
      let correct = 0; // contador de correctas
      COMPOUNDS.forEach(c => { // por cada compuesto
        const found = connections.find(k => k.from === c.id); // busca conexión
        if (!found) { // si no hay línea
          wrong.push(c.label + ' (sin conexión)'); // notifica
        } else if (SOLUTIONS[c.id] !== found.to) { // si destino incorrecto
          wrong.push(c.label); // agrega
        } else {
          correct++; // suma correctas
        }
      });

      const msg = document.getElementById('cMsg'); // contenedor mensaje
      if (wrong.length === 0 && correct === COMPOUNDS.length) { // todo correcto
        msg.textContent = '¡Muy bien! Todas las relaciones son correctas.';
      } else {
        msg.textContent = `Incorrectas: ${wrong.join(' | ')}. Se limpian líneas y se revuelven las columnas.`;
        // limpiar conexiones y redibujar mezclado
        connections.splice(0, connections.length); // borrar todas
        renderCols(); // re-render mezclado
      }
    });

    // --- Reiniciar ---
    document.getElementById('btnCReset').addEventListener('click', () => {
      const msg = document.getElementById('cMsg'); // mensaje
      msg.textContent = 'Reinicio: se limpiaron las conexiones y se revuelven las columnas.';
      connections.splice(0, connections.length); // borra conexiones
      renderCols(); // re-render
    });

    // --- Redibujar al cambiar tamaño/scroll para mantener líneas alineadas ---
    window.addEventListener('resize', redrawLines); // redibuja al redimensionar
    window.addEventListener('scroll', redrawLines, true); // redibuja al scroll

    // --- Inicio ---
    renderCols(); // pinta columnas