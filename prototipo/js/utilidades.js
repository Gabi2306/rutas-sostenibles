// Utilidades compartidas por todos los módulos.
// Se usa un único objeto global (App) como espacio de nombres para que el
// prototipo funcione abriendo index.html directamente, sin servidor.
window.App = window.App || {};

App.util = {
  $: (id) => document.getElementById(id),
  cop: (n) => "$ " + n.toLocaleString("es-CO"),
  fecha: (d) => new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long" }),
  NIVEL: { 1: "Baja", 2: "Media", 3: "Alta" },
};
