App.vistas = App.vistas || {};
App.vistas.perfil = (() => {
  const { $ } = App.util;

  function leer() {
    return {
      dif: +$("dif").value,
      acts: [...document.querySelectorAll("#acts input:checked")].map((i) => i.value),
      fecha: $("fecha").value,
    };
  }

  function iniciar() {
    $("ver").onclick = () => {
      $("guardado").textContent = "Perfil guardado.";
      location.hash = "#recomendadas";
    };
  }

  return { leer, iniciar, mostrar() {} };
})();
