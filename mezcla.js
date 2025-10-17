const MIXES = [
  { id: 'agua_sal', label: 'Agua con sal' },
  { id: 'arena_agua', label: 'Arena y agua' },
  { id: 'aire', label: 'Aire' },
  { id: 'petroleo', label: 'Petróleo crudo' },
  { id: 'azucar_agua', label: 'Agua con azúcar' },
  { id: 'aceite_agua', label: 'Aceite y agua' },
  { id: 'leche_chocolate', label: 'Leche con chocolate' },
  { id: 'vinagre_agua', label: 'Vinagre y agua' },
  { id: 'humo', label: 'Humo' },
  { id: 'sangre', label: 'Sangre' },
  { id: 'bronce', label: 'Bronce' },
  { id: 'acero', label: 'Acero' },
  { id: 'polvo_aire', label: 'Polvo en aire' },
  { id: 'agua_gas', label: 'Agua con gas' },
  { id: 'tinta_agua', label: 'Tinta en agua' }
];

const FORMULAS = [
  { id: 'agua_sal_c', label: 'H<sub>2</sub>O + NaCl' },
  { id: 'arena_agua_c', label: 'SiO<sub>2</sub> + H<sub>2</sub>O' },
  { id: 'aire_c', label: 'N<sub>2</sub>, O<sub>2</sub>, CO<sub>2</sub>, Ar' },
  { id: 'petroleo_c', label: 'C<sub>n</sub>H<sub>2n+2</sub> (mezcla)' },
  { id: 'azucar_agua_c', label: 'C<sub>12</sub>H<sub>22</sub>O<sub>11</sub> + H<sub>2</sub>O' },
  { id: 'aceite_agua_c', label: 'Triglicéridos + H<sub>2</sub>O' },
  { id: 'leche_chocolate_c', label: 'Proteínas + grasa + cacao' },
  { id: 'vinagre_agua_c', label: 'CH<sub>3</sub>COOH + H<sub>2</sub>O' },
  { id: 'humo_c', label: 'Partículas + gases' },
  { id: 'sangre_c', label: 'Plasma + células' },
  { id: 'bronce_c', label: 'Cu + Sn' },
  { id: 'acero_c', label: 'Fe + C' },
  { id: 'polvo_aire_c', label: 'Partículas sólidas + aire' },
  { id: 'agua_gas_c', label: 'CO<sub>2</sub> + H<sub>2</sub>O' },
  { id: 'tinta_agua_c', label: 'Pigmentos + H<sub>2</sub>O' }
];

const METHODS = [
  { id: 'agua_sal_m', label: 'Evaporación / Destilación' },
  { id: 'arena_agua_m', label: 'Filtración / Decantación' },
  { id: 'aire_m', label: 'Destilación fraccionada criogénica' },
  { id: 'petroleo_m', label: 'Destilación fraccionada' },
  { id: 'azucar_agua_m', label: 'Evaporación' },
  { id: 'aceite_agua_m', label: 'Decantación / Centrifugación' },
  { id: 'leche_chocolate_m', label: 'Centrifugación / Filtración' },
  { id: 'vinagre_agua_m', label: 'Destilación simple' },
  { id: 'humo_m', label: 'Filtración / Precipitación' },
  { id: 'sangre_m', label: 'Centrifugación' },
  { id: 'bronce_m', label: 'No separable físicamente' },
  { id: 'acero_m', label: 'No separable físicamente' },
  { id: 'polvo_aire_m', label: 'Filtración / Sedimentación' },
  { id: 'agua_gas_m', label: 'Desgasificación / Destilación' },
  { id: 'tinta_agua_m', label: 'Cromatografía / Evaporación' }
];

const TYPES = [
  { id: 'agua_sal_t', label: 'Homogénea (solución)' },
  { id: 'arena_agua_t', label: 'Heterogénea' },
  { id: 'aire_t', label: 'Homogénea (mezcla gaseosa)' },
  { id: 'petroleo_t', label: 'Heterogénea / Compleja' },
  { id: 'azucar_agua_t', label: 'Homogénea' },
  { id: 'aceite_agua_t', label: 'Heterogénea (emulsión)' },
  { id: 'leche_chocolate_t', label: 'Heterogénea (suspensión)' },
  { id: 'vinagre_agua_t', label: 'Homogénea' },
  { id: 'humo_t', label: 'Heterogénea (aerosol sólido)' },
  { id: 'sangre_t', label: 'Heterogénea (coloide)' },
  { id: 'bronce_t', label: 'Homogénea (aleación)' },
  { id: 'acero_t', label: 'Homogénea (aleación)' },
  { id: 'polvo_aire_t', label: 'Heterogénea (aerosol sólido)' },
  { id: 'agua_gas_t', label: 'Homogénea (solución gaseosa)' },
  { id: 'tinta_agua_t', label: 'Homogénea (solución líquida)' }
];

const MIX_MAP = {
  agua_sal: {
    formula: 'agua_sal_c',
    method: 'agua_sal_m',
    type: 'agua_sal_t'
  },
  arena_agua: { formula: 'arena_agua_c',method: 'arena_agua_m',type: 'arena_agua_t'},
  aire: {formula: 'aire_c',method: 'aire_m',type: 'aire_t'},
  petroleo: {
    formula: 'petroleo_c',
    method: 'petroleo_m',
    type: 'petroleo_t'
  },
  azucar_agua: {
    formula: 'azucar_agua_c',
    method: 'azucar_agua_m',
    type: 'azucar_agua_t'
  },
  aceite_agua: {
    formula: 'aceite_agua_c',
    method: 'aceite_agua_m',
    type: 'aceite_agua_t'
  },
  leche_chocolate: {
    formula: 'leche_chocolate_c',
    method: 'leche_chocolate_m',
    type: 'leche_chocolate_t'
  },
  vinagre_agua: {
    formula: 'vinagre_agua_c',
    method: 'vinagre_agua_m',
    type: 'vinagre_agua_t'
  },
  humo: {
    formula: 'humo_c',
    method: 'humo_m',
    type: 'humo_t'
  },
  sangre: {
    formula: 'sangre_c',
    method: 'sangre_m',
    type: 'sangre_t'
  },
  bronce: {
    formula: 'bronce_c',
    method: 'bronce_m',
    type: 'bronce_t'
  },
  acero: {
    formula: 'acero_c',
    method: 'acero_m',
    type: 'acero_t'
  },
  polvo_aire: {
    formula: 'polvo_aire_c',
    method: 'polvo_aire_m',
    type: 'polvo_aire_t'
  },
  agua_gas: {
    formula: 'agua_gas_c',
    method: 'agua_gas_m',
    type: 'agua_gas_t'
  },
  tinta_agua: {
    formula: 'tinta_agua_c',
    method: 'tinta_agua_m',
    type: 'tinta_agua_t'
  }
};
const state = new Map();

function renderTags() {
  const pool = document.getElementById('tagsPool');
  pool.innerHTML = '';

  MIXES.forEach(mix => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.draggable = true;
    tag.textContent = mix.label;
    tag.dataset.id = mix.id;
    tag.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', mix.id);
    });
    pool.appendChild(tag);
    state.set(mix.id, 'pool');
  });
}

function getLabelById(id) {
  const all = [...FORMULAS, ...METHODS, ...TYPES];
  const item = all.find(x => x.id === id);
  return item ? item.label : 'Desconocido';
}

const mixZone = document.getElementById('mixZone');
mixZone.addEventListener('dragover', e => e.preventDefault());
mixZone.addEventListener('drop', e => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const tag = document.querySelector(`.tag[data-id="${id}"]`);
  if (!tag || !MIX_MAP[id]) return;

  // Si ya hay una tarjeta en mixZone, devuélvela al pool
  const previous = mixZone.querySelector('.tag');
  if (previous) {
  tagsPool.appendChild(previous);
  state.set(previous.dataset.id, 'pool');
  }

 state.set(id, 'mix');
  mixZone.innerHTML = '';
  mixZone.appendChild(tag);
  state.set(id, 'mix');

  const { formula, method, type } = MIX_MAP[id];
  document.getElementById('formulaZone').innerHTML = `<div class="tag">${getLabelById(formula)}</div>`;
  document.getElementById('methodZone').innerHTML = `<div class="tag">${getLabelById(method)}</div>`;
  document.getElementById('typeZone').innerHTML = `<div class="tag">${getLabelById(type)}</div>`;
});

const tagsPool = document.getElementById('tagsPool');
tagsPool.addEventListener('dragover', e => e.preventDefault());
tagsPool.addEventListener('drop', e => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const tag = document.querySelector(`.tag[data-id="${id}"]`);
  if (!tag) return;

  tagsPool.appendChild(tag);
  state.set(id, 'pool');

  document.getElementById('mixZone').innerHTML = '';
  document.getElementById('formulaZone').innerHTML = '';
  document.getElementById('methodZone').innerHTML = '';
  document.getElementById('typeZone').innerHTML = '';
});

document.getElementById('btnMReset').addEventListener('click', () => {
  document.getElementById('mMsg').textContent = 'Reinicio completo.';
  resetAll();
});

function resetAll() {
  document.getElementById('mixZone').innerHTML = '';
  document.getElementById('formulaZone').innerHTML = '';
  document.getElementById('methodZone').innerHTML = '';
  document.getElementById('typeZone').innerHTML = '';
  document.getElementById('tagsPool').innerHTML = '';
  renderTags();
}

// Inicializa
renderTags();