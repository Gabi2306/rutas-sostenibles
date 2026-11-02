App.servicios = (() => {
  const { NIVEL, fecha } = App.util;
  const d = App.datos;

  function cierreVigente(zona, dia) {
    return d.cierres.find((c) => c.zona === zona && c.ini <= dia && dia <= c.fin);
  }

  function motivoDescarte(ruta, perfil) {
    const c = cierreVigente(ruta.zona, perfil.fecha);
    if (c) return "La zona está cerrada del " + fecha(c.ini) + " al " + fecha(c.fin) + ". " + c.motivo + ".";
    if (ruta.dif > perfil.dif) return "Es de dificultad " + NIVEL[ruta.dif].toLowerCase() + " y marcaste " + NIVEL[perfil.dif].toLowerCase() + " como máximo.";
    if (!perfil.acts.includes(ruta.act)) return "Es de " + ruta.act.toLowerCase() + ", que no marcaste entre lo que te gusta.";
    return null;
  }

  return {
    total: () => d.rutas.length,

    recomendarRutas(perfil) {
      const aptas = [], descartadas = [];
      d.rutas.forEach((r) => {
        const motivo = motivoDescarte(r, perfil);
        motivo ? descartadas.push({ ruta: r, motivo }) : aptas.push({ ruta: r });
      });
      return { aptas, descartadas };
    },

    disponibilidad(id, dia) {
      const ruta = d.rutas.find((r) => r.id === id);
      if (!ruta) return null;
      return { ruta, cierre: cierreVigente(ruta.zona, dia) || null };
    },

    crearSolicitud(idRuta, dia) {
      const s = { id: d.solicitudes.length + 1, idRuta, fecha: dia, estado: "pendiente" };
      d.solicitudes.push(s);
      return s;
    },

    publicarRuta(ruta) {
      return { ok: true, ruta };
    },

    publicarCierre(cierre) {
      if (cierre.fin < cierre.ini) return { ok: false, error: "La fecha final no puede ser anterior a la inicial. Corrígela para publicar el cierre." };
      d.cierres.push(cierre);
      return { ok: true, cierre };
    },
  };
})();
