// --- Utilidades generales ---
// Manejo del menú hamburguesa (abrir/cerrar)

/* Obtiene el botón de hamburguesa */
const burger = document.querySelector('.burger');
/* Obtiene el panel del menú de navegación */
const nav = document.querySelector('.nav');

/* Si existen en la página actual, añade el listener */
if (burger && nav) {
  burger.addEventListener('click', () => { // al hacer clic
    nav.classList.toggle('open'); // alterna la clase open
  });
}

/* Cierra el menú al hacer clic fuera */
document.addEventListener('click', (e) => { // escucha clics globales
  if (!nav || !burger) return; // si no hay nav/burger, no hace nada
  const clickedInsideNav = nav.contains(e.target) || burger.contains(e.target); // verifica si clic fue dentro
  if (!clickedInsideNav) nav.classList.remove('open'); // cierra si fue afuera
});

// --- Helper para mezclar arreglos (shuffle) ---
function shuffle(array) { // función para mezclar elementos
  for (let i = array.length - 1; i > 0; i--) { // desde el final
    const j = Math.floor(Math.random() * (i + 1)); // índice aleatorio
    [array[i], array[j]] = [array[j], array[i]]; // intercambio
  }
  return array; // retorna el arreglo mezclado
}

// --- Exponer helpers globalmente para otras páginas ---
window.AppHelpers = { shuffle }; // guarda helpers en window