App.vistas = App.vistas || {};
App.vistas.oferta = (() => {
  const { $ } = App.util;

  function iniciar() {
    $("publicar").onclick = () => {
      const { ruta } = App.servicios.publicarRuta({ nombre: $("o-nombre").value, zona: $("o-zona").value, dificultad: $("o-dif").value });
      $("o-estado").textContent = "Ruta publicada: " + ruta.nombre + " (" + ruta.zona + ", dificultad " + ruta.dificultad.toLowerCase() + ").";
    };
  }

  return { iniciar, mostrar() {} };
})();
