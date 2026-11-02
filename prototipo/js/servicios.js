// Servicios simulados. Cada función corresponde a un servicio REST del
// documento técnico (sección 6). Las vistas solo hablan con este módulo,
// nunca con App.datos directamente, igual que la SPA solo habla con la API.
// Aquí viven las reglas del dominio (las mismas de la ontología).
App.servicios = (() => {
  const { NIVEL, fecha } = App.util;
  const d = App.datos;

  // Regla: una zona está cerrada si tiene un cierre que cubre la fecha (ZonaCerrada).
  function cierreVigente(zona, dia) {
    return d.cierres.find((c) => c.zona === zona && c.ini <= dia && dia <= c.fin);
  }

  // Regla de recomendación: zona abierta, dificultad <= la que soporta, actividad preferida.
  function motivoDescarte(ruta, perfil) {
    const c = cierreVigente(ruta.zona, perfil.fecha);
    if (c) return "La zona está cerrada del " + fecha(c.ini) + " al " + fecha(c.fin) + ". " + c.motivo + ".";
    if (ruta.dif > perfil.dif) return "Es de dificultad " + NIVEL[ruta.dif].toLowerCase() + " y marcaste " + NIVEL[perfil.dif].toLowerCase() + " como máximo.";
    if (!perfil.acts.includes(ruta.act)) return "Es de " + ruta.act.toLowerCase() + ", que no marcaste entre lo que te gusta.";
    return null;
  }

  return {
    total: () => d.rutas.length,

    // GET /rutas/recomendadas?perfil&fecha -> rutas aptas y descartadas con motivo
    recomendarRutas(perfil) {
      const aptas = [], descartadas = [];
      d.rutas.forEach((r) => {
        const motivo = motivoDescarte(r, perfil);
        motivo ? descartadas.push({ ruta: r, motivo }) : aptas.push({ ruta: r });
      });
      return { aptas, descartadas };
    },

    // GET /rutas/{id}/disponibilidad?fecha -> ruta, cierre vigente (o null)
    disponibilidad(id, dia) {
      const ruta = d.rutas.find((r) => r.id === id);
      if (!ruta) return null;
      return { ruta, cierre: cierreVigente(ruta.zona, dia) || null };
    },

    // POST /solicitudes
    crearSolicitud(idRuta, dia) {
      const s = { id: d.solicitudes.length + 1, idRuta, fecha: dia, estado: "pendiente" };
      d.solicitudes.push(s);
      return s;
    },

    // POST /rutas (guías y operadores)
    publicarRuta(ruta) {
      return { ok: true, ruta };
    },

    // POST /zonas/{id}/cierres (autoridad ambiental). Valida las fechas.
    publicarCierre(cierre) {
      if (cierre.fin < cierre.ini) return { ok: false, error: "La fecha final no puede ser anterior a la inicial. Corrígela para publicar el cierre." };
      d.cierres.push(cierre);
      return { ok: true, cierre };
    },
  };
})();
