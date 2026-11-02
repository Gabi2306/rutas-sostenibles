from pathlib import Path

from owlready2 import default_world, get_ontology, sync_reasoner

AQUI = Path(__file__).resolve().parent
onto = get_ontology("file://" + (AQUI / "rutas_sostenibles.owl").as_posix()).load()
with onto:
    sync_reasoner(infer_property_values=False, debug=0)

inconsistentes = list(default_world.inconsistent_classes())
print("Clases inconsistentes:", inconsistentes or "ninguna")
for r in onto.Ruta.instances():
    print(r.name, "->", sorted(c.name for c in r.is_a if hasattr(c, "name")))
print("ZonaTayrona ->", sorted(c.name for c in onto.ZonaTayrona.is_a if hasattr(c, "name")))

assert onto.RutaNoDisponible in onto.RutaTayronaCanaveral.is_a
assert onto.RutaAltaDificultad in onto.RutaCiudadPerdida.is_a
assert onto.RutaGuiadaObligatoria in onto.RutaCiudadPerdida.is_a
assert onto.RutaNoDisponible not in onto.RutaMincaCascadas.is_a
print("OK: inferencias esperadas")
