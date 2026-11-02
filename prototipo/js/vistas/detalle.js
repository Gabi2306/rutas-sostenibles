App.vistas = App.vistas || {};
App.vistas.detalle = (() => {
  const { $, cop, fecha, NIVEL } = App.util;
  let actual = null;

  function mostrar(id) {
    const p = App.vistas.perfil.leer();
    const info = App.servicios.disponibilidad(id, p.fecha);
    if (!info) { location.hash = "#recomendadas"; return; }
    const { ruta: r, cierre: c } = info;
    actual = r;

    $("d-nombre").textContent = r.nombre;
    $("d-sub").textContent = r.zona + " · " + r.act;
    $("d-estado").innerHTML = c
      ? "<span class='no'>Cerrada hasta el " + fecha(c.fin) + "</span>"
      : "<span class='ok'>Abierta el " + fecha(p.fecha) + "</span>";
    $("d-dif").textContent = NIVEL[r.dif];
    $("d-dur").textContent = r.horas >= 24 ? (r.horas / 24) + " días" : r.horas + " horas";
    $("d-costo").textContent = cop(r.costo) + " (cifra ilustrativa)";
    $("d-cupo").textContent = r.cupo.toLocaleString("es-CO") + " personas por día (cifra ilustrativa)";
    $("d-norma").textContent = r.norma;

    const aviso = c
      ? "No puedes solicitar esta ruta en esta fecha: la zona está cerrada hasta el " + fecha(c.fin) + ". " + c.motivo + "."
      : (r.guia ? "Esta ruta solo se puede hacer con un operador autorizado." : "");
    $("d-aviso").hidden = !aviso;
    $("d-aviso").textContent = aviso;
    $("pedir").disabled = !!c;
    $("pedido").textContent = "";
  }

  function iniciar() {
    $("pedir").onclick = () => {
      App.servicios.crearSolicitud(actual.id, App.vistas.perfil.leer().fecha);
      $("pedido").textContent = "Solicitud enviada. Te escribirá un guía u operador para confirmar.";
    };
  }

  return { iniciar, mostrar };
})();
