App.vistas = App.vistas || {};
App.vistas.recomendadas = (() => {
  const { $, cop, fecha, NIVEL } = App.util;

  function tarjeta(r, motivo) {
    const enlace = "<a class='boton" + (motivo ? " sec" : "") + "' href='#detalle:" + r.id + "'>" +
      (motivo ? "Ver estado de la ruta" : "Ver detalle") + "</a>";
    return "<div class='tarjeta" + (motivo ? " descartada" : "") + "'><strong>" + r.nombre + "</strong><br>" +
      "<span class='etiqueta'>" + r.zona + "</span>" +
      "<span class='etiqueta'>Dificultad " + NIVEL[r.dif].toLowerCase() + "</span>" +
      "<span class='etiqueta'>" + r.act + "</span>" +
      (motivo ? "<p class='no'>" + motivo + "</p>" : "<p>Duración: " + r.horas + " h · Desde " + cop(r.costo) + "</p>") +
      enlace + "</div>";
  }

  function mostrar() {
    const p = App.vistas.perfil.leer();
    const { aptas, descartadas } = App.servicios.recomendarRutas(p);
    $("resumen").textContent = "Para el " + fecha(p.fecha) + ", caminatas de dificultad hasta " +
      NIVEL[p.dif].toLowerCase() + ": " + aptas.length + " de " + App.servicios.total() + " rutas son aptas para ti.";
    $("aptas").innerHTML = aptas.length
      ? aptas.map((x) => tarjeta(x.ruta)).join("")
      : "<div class='aviso'>Ninguna ruta cumple con todo lo que marcaste. Prueba con otra fecha o con más actividades.</div>";
    $("descartadas").innerHTML = descartadas.map((x) => tarjeta(x.ruta, x.motivo)).join("");
  }

  return { iniciar() {}, mostrar };
})();
