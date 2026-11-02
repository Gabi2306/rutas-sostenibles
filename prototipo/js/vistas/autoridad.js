App.vistas = App.vistas || {};
App.vistas.autoridad = (() => {
  const { $, fecha } = App.util;

  function iniciar() {
    $("cerrar").onclick = () => {
      const res = App.servicios.publicarCierre({ zona: $("a-zona").value, ini: $("a-ini").value, fin: $("a-fin").value, motivo: $("a-motivo").value });
      if (!res.ok) { $("a-estado").textContent = res.error; return; }
      const c = res.cierre;
      $("a-estado").textContent = "Cierre publicado para " + c.zona + " del " + fecha(c.ini) + " al " + fecha(c.fin) + ". Ya afecta las recomendaciones.";
    };
  }

  return { iniciar, mostrar() {} };
})();
