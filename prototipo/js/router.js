// Enrutador: implementa el modelo navegacional. Cada #hash es un nodo de navegación;
// #detalle:<id> es un nodo con parámetro (la ruta elegida).
App.router = (() => {
  function ir() {
    const [nodo, param] = decodeURIComponent(location.hash || "#perfil").slice(1).split(":");
    document.querySelectorAll("section").forEach((s) => s.classList.toggle("visible", s.id === nodo));
    document.querySelectorAll("#menu a").forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + nodo));
    const vista = App.vistas[nodo];
    if (vista) vista.mostrar(param);
  }

  function iniciar() {
    addEventListener("hashchange", ir);
    ir();
  }

  return { iniciar };
})();
