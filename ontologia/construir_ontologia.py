from itertools import combinations
from pathlib import Path

from rdflib import BNode, Graph, Literal, Namespace, URIRef
from rdflib.collection import Collection
from rdflib.namespace import OWL, RDF, RDFS, XSD

AQUI = Path(__file__).resolve().parent
IRI = URIRef("http://example.org/turismo/RutasSostenibles")
T = Namespace(str(IRI) + "#")

g = Graph()
g.bind("", T)
g.add((IRI, RDF.type, OWL.Ontology))

for c in ("Usuario", "OperadorTuristico", "AutoridadAmbiental", "Ruta", "Zona", "Dificultad", "Cierre", "Norma", "TipoActividad"):
    g.add((T[c], RDF.type, OWL.Class))
for sub in ("Turista", "Guia"):
    g.add((T[sub], RDF.type, OWL.Class))
    g.add((T[sub], RDFS.subClassOf, T.Usuario))

OBJ = [
    ("recorre", "Ruta", "Zona"),
    ("tieneDificultad", "Ruta", "Dificultad"),
    ("tieneActividad", "Ruta", "TipoActividad"),
    ("ofrecidaPor", "Ruta", "OperadorTuristico"),
    ("guiadaPor", "Ruta", "Guia"),
    ("afectaA", "Cierre", "Zona"),
    ("emiteCierre", "AutoridadAmbiental", "Cierre"),
    ("tieneCierreVigente", "Zona", "Cierre"),
    ("aplicaEn", "Norma", "Zona"),
    ("prefiereActividad", "Turista", "TipoActividad"),
    ("soportaDificultad", "Turista", "Dificultad"),
    ("trabajaCon", "Guia", "OperadorTuristico"),
]
for p, d, r in OBJ:
    g.add((T[p], RDF.type, OWL.ObjectProperty))
    g.add((T[p], RDFS.domain, T[d]))
    g.add((T[p], RDFS.range, T[r]))

DATA = [
    ("nombre", None, XSD.string),
    ("capacidadDiaria", "Zona", XSD.integer),
    ("duracionHoras", "Ruta", XSD.decimal),
    ("costoEstimado", "Ruta", XSD.integer),
    ("fechaInicio", "Cierre", XSD.dateTime),
    ("fechaFin", "Cierre", XSD.dateTime),
    ("motivo", "Cierre", XSD.string),
]
for p, d, r in DATA:
    g.add((T[p], RDF.type, OWL.DatatypeProperty))
    if d:
        g.add((T[p], RDFS.domain, T[d]))
    g.add((T[p], RDFS.range, r))


def restriccion(clase, prop, tipo, valor, sobre):
    r = BNode()
    g.add((r, RDF.type, OWL.Restriction))
    g.add((r, OWL.onProperty, T[prop]))
    if tipo == "exactly":
        g.add((r, OWL.qualifiedCardinality, Literal(valor, datatype=XSD.nonNegativeInteger)))
        g.add((r, OWL.onClass, T[sobre]))
    elif tipo == "min":
        g.add((r, OWL.minQualifiedCardinality, Literal(valor, datatype=XSD.nonNegativeInteger)))
        g.add((r, OWL.onClass, T[sobre]))
    elif tipo == "some":
        g.add((r, OWL.someValuesFrom, sobre if isinstance(sobre, (BNode, URIRef)) else T[sobre]))
    else:
        g.add((r, OWL.hasValue, T[sobre]))
    return r


def equivalente(clase, *partes):
    lista = BNode()
    Collection(g, lista, list(partes))
    inter = BNode()
    g.add((inter, RDF.type, OWL.Class))
    g.add((inter, OWL.intersectionOf, lista))
    g.add((T[clase], RDF.type, OWL.Class))
    g.add((T[clase], OWL.equivalentClass, inter))


g.add((T.Ruta, RDFS.subClassOf, restriccion("Ruta", "tieneDificultad", "exactly", 1, "Dificultad")))
g.add((T.Ruta, RDFS.subClassOf, restriccion("Ruta", "recorre", "min", 1, "Zona")))
g.add((T.Cierre, RDFS.subClassOf, restriccion("Cierre", "afectaA", "min", 1, "Zona")))
g.add((T.Turista, RDFS.subClassOf, restriccion("Turista", "soportaDificultad", "exactly", 1, "Dificultad")))

equivalente("ZonaCerrada", T.Zona, restriccion("", "tieneCierreVigente", "some", None, "Cierre"))
equivalente("RutaNoDisponible", T.Ruta, restriccion("", "recorre", "some", None, T.ZonaCerrada))
equivalente("RutaAltaDificultad", T.Ruta, restriccion("", "tieneDificultad", "value", None, "Alta"))
equivalente("RutaGuiadaObligatoria", T.Ruta, restriccion("", "tieneActividad", "value", None, "Trekking"))


def ind(nombre, clase, etiqueta):
    g.add((T[nombre], RDF.type, OWL.NamedIndividual))
    g.add((T[nombre], RDF.type, T[clase]))
    g.add((T[nombre], T.nombre, Literal(etiqueta, datatype=XSD.string)))


for n, e in (("Baja", "Baja"), ("Media", "Media"), ("Alta", "Alta")):
    ind(n, "Dificultad", e)
for n, e in (("Trekking", "Trekking"), ("Buceo", "Buceo"), ("Ecoturismo", "Ecoturismo"), ("Cultural", "Cultural")):
    ind(n, "TipoActividad", e)
for n, e, cap in (("ZonaTayrona", "Parque Nacional Natural Tayrona", 4000), ("ZonaCiudadPerdida", "Sector Ciudad Perdida (Teyuna)", 250),
                  ("ZonaMinca", "Minca", 1500), ("ZonaTaganga", "Taganga", 2000)):
    ind(n, "Zona", e)
    g.add((T[n], T.capacidadDiaria, Literal(cap, datatype=XSD.integer)))
for n, e, z, d, a, h, c in (
    ("RutaCiudadPerdida", "Trek a Ciudad Perdida", "ZonaCiudadPerdida", "Alta", "Trekking", 96, 1800000),
    ("RutaTayronaCanaveral", "Sendero Tayrona hasta Cañaveral", "ZonaTayrona", "Media", "Ecoturismo", 5, 120000),
    ("RutaMincaCascadas", "Cascadas y café en Minca", "ZonaMinca", "Baja", "Ecoturismo", 6, 90000),
    ("RutaTagangaBuceo", "Buceo en Taganga", "ZonaTaganga", "Media", "Buceo", 4, 150000),
):
    ind(n, "Ruta", e)
    g.add((T[n], T.recorre, T[z]))
    g.add((T[n], T.tieneDificultad, T[d]))
    g.add((T[n], T.tieneActividad, T[a]))
    g.add((T[n], T.duracionHoras, Literal(h, datatype=XSD.decimal)))
    g.add((T[n], T.costoEstimado, Literal(c, datatype=XSD.integer)))

ind("OperadorSierraSegura", "OperadorTuristico", "Sierra Segura (operador ficticio)")
ind("GuiaLaura", "Guia", "Laura (guía ficticia)")
ind("ParquesNacionales", "AutoridadAmbiental", "Parques Nacionales Naturales")
ind("TuristaAna", "Turista", "Ana (turista ficticia)")
ind("CierreTayronaFebrero", "Cierre", "Cierre periódico del Tayrona")
ind("NormaSinResiduos", "Norma", "No dejar residuos ni dañar flora y fauna")

g.add((T.RutaCiudadPerdida, T.ofrecidaPor, T.OperadorSierraSegura))
g.add((T.RutaCiudadPerdida, T.guiadaPor, T.GuiaLaura))
g.add((T.GuiaLaura, T.trabajaCon, T.OperadorSierraSegura))
g.add((T.ParquesNacionales, T.emiteCierre, T.CierreTayronaFebrero))
g.add((T.CierreTayronaFebrero, T.afectaA, T.ZonaTayrona))
g.add((T.CierreTayronaFebrero, T.fechaInicio, Literal("2026-02-01T00:00:00", datatype=XSD.dateTime)))
g.add((T.CierreTayronaFebrero, T.fechaFin, Literal("2026-02-15T23:59:59", datatype=XSD.dateTime)))
g.add((T.CierreTayronaFebrero, T.motivo, Literal("Cierre periódico acordado con pueblos indígenas", datatype=XSD.string)))
g.add((T.ZonaTayrona, T.tieneCierreVigente, T.CierreTayronaFebrero))
g.add((T.NormaSinResiduos, T.aplicaEn, T.ZonaTayrona))
g.add((T.TuristaAna, T.soportaDificultad, T.Media))
g.add((T.TuristaAna, T.prefiereActividad, T.Ecoturismo))

for grupo in (("Baja", "Media", "Alta"), ("Trekking", "Buceo", "Ecoturismo", "Cultural")):
    for a, b in combinations(grupo, 2):
        g.add((T[a], OWL.differentFrom, T[b]))

g.serialize(AQUI / "rutas_sostenibles.owl", format="xml")
g.serialize(AQUI / "rutas_sostenibles.ttl", format="turtle")
print(len(g), "tripletas")
