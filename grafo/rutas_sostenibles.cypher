MATCH (n) DETACH DELETE n;

CREATE (baja:Dificultad {nombre:'Baja', nivel:1}),
       (media:Dificultad {nombre:'Media', nivel:2}),
       (alta:Dificultad {nombre:'Alta', nivel:3}),
       (trek:TipoActividad {nombre:'Trekking'}),
       (buceo:TipoActividad {nombre:'Buceo'}),
       (eco:TipoActividad {nombre:'Ecoturismo'}),
       (tayrona:Zona {nombre:'Parque Nacional Natural Tayrona', capacidadDiaria:4000}),
       (cperdida:Zona {nombre:'Sector Ciudad Perdida (Teyuna)', capacidadDiaria:250}),
       (minca:Zona {nombre:'Minca', capacidadDiaria:1500}),
       (taganga:Zona {nombre:'Taganga', capacidadDiaria:2000}),
       (rcp:Ruta {nombre:'Trek a Ciudad Perdida', duracionHoras:96, costoEstimado:1800000}),
       (rtay:Ruta {nombre:'Sendero Tayrona hasta Cañaveral', duracionHoras:5, costoEstimado:120000}),
       (rmin:Ruta {nombre:'Cascadas y café en Minca', duracionHoras:6, costoEstimado:90000}),
       (rtag:Ruta {nombre:'Buceo en Taganga', duracionHoras:4, costoEstimado:150000}),
       (op:OperadorTuristico {nombre:'Sierra Segura (ficticio)'}),
       (guia:Guia {nombre:'Laura (ficticia)'}),
       (pnn:AutoridadAmbiental {nombre:'Parques Nacionales Naturales'}),
       (cierre:Cierre {nombre:'Cierre periódico del Tayrona', fechaInicio:date('2026-02-01'), fechaFin:date('2026-02-15')}),
       (ana:Turista {nombre:'Ana (ficticia)'}),
       (rcp)-[:RECORRE]->(cperdida),
       (rtay)-[:RECORRE]->(tayrona),
       (rmin)-[:RECORRE]->(minca),
       (rtag)-[:RECORRE]->(taganga),
       (rcp)-[:TIENE_DIFICULTAD]->(alta),
       (rtay)-[:TIENE_DIFICULTAD]->(media),
       (rmin)-[:TIENE_DIFICULTAD]->(baja),
       (rtag)-[:TIENE_DIFICULTAD]->(media),
       (rcp)-[:TIENE_ACTIVIDAD]->(trek),
       (rtay)-[:TIENE_ACTIVIDAD]->(eco),
       (rmin)-[:TIENE_ACTIVIDAD]->(eco),
       (rtag)-[:TIENE_ACTIVIDAD]->(buceo),
       (rcp)-[:OFRECIDA_POR]->(op),
       (rcp)-[:GUIADA_POR]->(guia),
       (guia)-[:TRABAJA_CON]->(op),
       (pnn)-[:EMITE_CIERRE]->(cierre),
       (cierre)-[:AFECTA_A]->(tayrona),
       (ana)-[:SOPORTA_DIFICULTAD]->(media),
       (ana)-[:PREFIERE_ACTIVIDAD]->(eco);

// Consulta 1. Rutas disponibles en una fecha: la zona que recorren no tiene un cierre que cubra esa fecha.
MATCH (r:Ruta)-[:RECORRE]->(z:Zona)
WHERE NOT EXISTS {
  MATCH (c:Cierre)-[:AFECTA_A]->(z)
  WHERE c.fechaInicio <= date('2026-02-10') <= c.fechaFin
}
RETURN r.nombre AS ruta, z.nombre AS zona
ORDER BY ruta;

// Consulta 2. Rutas de trekking: quién las ofrece y quién las guía.
MATCH (r:Ruta)-[:TIENE_ACTIVIDAD]->(:TipoActividad {nombre:'Trekking'})
OPTIONAL MATCH (r)-[:OFRECIDA_POR]->(op:OperadorTuristico)
OPTIONAL MATCH (r)-[:GUIADA_POR]->(g:Guia)
RETURN r.nombre AS ruta, op.nombre AS operador, g.nombre AS guia;

// Consulta 3 (recomendación). Rutas para Ana el 2026-02-10: dificultad que soporta o menor,
// actividad que prefiere y zona abierta ese día. La relación "recomendada" no está guardada en el grafo.
MATCH (t:Turista {nombre:'Ana (ficticia)'})-[:SOPORTA_DIFICULTAD]->(dt:Dificultad),
      (t)-[:PREFIERE_ACTIVIDAD]->(a:TipoActividad)
MATCH (r:Ruta)-[:TIENE_ACTIVIDAD]->(a),
      (r)-[:TIENE_DIFICULTAD]->(dr:Dificultad),
      (r)-[:RECORRE]->(z:Zona)
WHERE dr.nivel <= dt.nivel
  AND NOT EXISTS {
    MATCH (c:Cierre)-[:AFECTA_A]->(z)
    WHERE c.fechaInicio <= date('2026-02-10') <= c.fechaFin
  }
RETURN r.nombre AS rutaRecomendada, dr.nombre AS dificultad, z.nombre AS zona, r.costoEstimado AS costo
ORDER BY costo;
