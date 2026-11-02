# Proyecto final: rutas de turismo sostenible en Santa Marta

Doris Arzuaga y Gabriela Zabaleta. Ingeniería Web.

## Qué contiene

| Carpeta o archivo | Para qué sirve |
|---|---|
| `Proyecto_Final_Rutas_Sostenibles.docx` / `.pdf` | Documento técnico consolidado (entregable 1) |
| `evidencias/` | Diagramas y evidencias de ejecución en Protégé y Neo4j (entregables 2 y 6) |
| `prototipo/index.html` | Prototipo navegable (entregable 3) |
| `ontologia/rutas_sostenibles.owl` | Ontología en formato OWL (entregable 4); `.ttl` es la misma en Turtle |
| `grafo/rutas_sostenibles.cypher` | Consultas y carga del grafo en Cypher (entregable 5) |
| `grafo/cargar_grafo.ps1` | Levanta Neo4j en Docker y carga el grafo |
| `presentacion/` | Presentación de la sustentación (entregable 8) |

El repositorio Git (entregable 7) no va en este zip: se crea con la carpeta del proyecto y se sube a GitHub.

## Cómo ejecutarlo en otro computador

### 1. Prototipo (no necesita nada)
Abrir `prototipo/index.html` con cualquier navegador. Con la fecha 2026-02-10 el sendero del Tayrona aparece descartado por el cierre.

### 2. Ontología en Protégé
1. Instalar Protégé 5.6.9 desde https://protege.stanford.edu/ (incluye su propio Java).
2. Abrir `ontologia/rutas_sostenibles.owl`.
3. Menú Reasoner, elegir HermiT 1.4.3.456 y luego Start reasoner.
4. En Entities, Individuals: `RutaTayronaCanaveral` aparece como `RutaNoDisponible` (inferido) y `RutaCiudadPerdida` como `RutaAltaDificultad` y `RutaGuiadaObligatoria`.

### 3. Regenerar y verificar la ontología (opcional)
Requiere Python 3.10 o superior y Java 11 o superior (HermiT).

    pip install -r requirements.txt
    python ontologia/construir_ontologia.py
    python ontologia/verificar_ontologia.py

La verificación imprime las clases inferidas y termina con `OK: inferencias esperadas`.

### 4. Grafo en Neo4j
Requiere Docker Desktop encendido.

Windows (PowerShell, desde la carpeta del proyecto):

    powershell -ExecutionPolicy Bypass -File grafo/cargar_grafo.ps1

Linux o macOS:

    docker run -d --name neo4j-turismo -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/turismo2026 neo4j:5
    docker cp grafo/rutas_sostenibles.cypher neo4j-turismo:/var/lib/neo4j/import/rutas.cypher
    docker exec neo4j-turismo cypher-shell -u neo4j -p turismo2026 --format plain -f /var/lib/neo4j/import/rutas.cypher

Para verlo en el navegador: http://localhost:7474 (usuario `neo4j`, contraseña `turismo2026`) y pegar las consultas de `grafo/rutas_sostenibles.cypher`.
Esa contraseña es solo para este laboratorio local.

Para apagarlo: `docker rm -f neo4j-turismo`.

## Aviso sobre los datos
Los datos de personas, operadores y las cifras de capacidad son ficticios o sintéticos. Los cierres del Parque Tayrona y los datos de Ciudad Perdida vienen de prensa y no están verificados con fuentes oficiales.
