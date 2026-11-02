# Proyecto final: rutas de turismo sostenible en Santa Marta

Doris Arzuaga y Gabriela Zabaleta. Ingeniería Web.

## Qué contiene

| Carpeta o archivo | Para qué sirve |
|---|---|
| `Proyecto_Final_Rutas_Sostenibles.docx` / `.pdf` | Documento técnico consolidado (entregable 1) |
| `evidencias/` | Diagramas y evidencias de ejecución en Protégé y Neo4j (entregables 2 y 6) |
| `prototipo/` | Prototipo navegable (entregable 3): `index.html` + `css/` + `js/` |
| `ontologia/rutas_sostenibles.owl` | Ontología en formato OWL (entregable 4); `.ttl` es la misma en Turtle |
| `grafo/rutas_sostenibles.cypher` | Consultas y carga del grafo en Cypher (entregable 5) |
| `grafo/cargar_grafo.ps1` | Levanta Neo4j en Docker y carga el grafo |
| `presentacion/` | Presentación de la sustentación (entregable 8) |

El repositorio Git (entregable 7) es esta misma carpeta (`git log` muestra el historial).

## Subir el repositorio a GitHub y publicar el prototipo

1. Crear un repositorio vacío en https://github.com/new (por ejemplo `rutas-sostenibles`, público, sin README).
2. Desde esta carpeta:

        git remote add origin https://github.com/USUARIO/rutas-sostenibles.git
        git push -u origin main

3. Agregar a la otra integrante como colaboradora (Settings, Collaborators) para que sus aportes queden con su nombre.
4. Prototipo en línea: Settings, Pages, Branch `main`, carpeta `/ (root)`. El enlace queda en
   `https://USUARIO.github.io/rutas-sostenibles/prototipo/`.
5. Pegar ambos enlaces en la sección 10 del documento (resaltados en amarillo), exportar de nuevo a PDF y hacer commit.

## Cómo ejecutarlo en otro computador

### 1. Prototipo (no necesita nada)
Abrir `prototipo/index.html` con cualquier navegador. Con la fecha 2026-02-10 el sendero del Tayrona aparece descartado por el cierre.

Estructura del código (módulos que siguen la arquitectura del documento):

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Solo la estructura de las pantallas |
| `css/estilos.css` | Estilos |
| `js/utilidades.js` | Funciones comunes (formato de fechas y moneda) |
| `js/datos.js` | Datos simulados; en la solución real están en el grafo |
| `js/servicios.js` | API REST simulada (un método por servicio) y reglas del dominio |
| `js/vistas/*.js` | Un módulo por pantalla: perfil, recomendadas, detalle, oferta, autoridad |
| `js/router.js` | Modelo navegacional: muestra la pantalla según el `#hash` |
| `js/app.js` | Punto de entrada |

Se usan scripts clásicos con un espacio de nombres `App` (no módulos ES) para que funcione al abrirlo con doble clic, sin servidor.

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
