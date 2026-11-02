$ErrorActionPreference = "Continue"
$raiz = Split-Path -Parent $PSScriptRoot
docker rm -f neo4j-turismo 2>$null | Out-Null
docker run -d --name neo4j-turismo -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/turismo2026 neo4j:5
for ($i = 0; $i -lt 40; $i++) {
    docker exec neo4j-turismo cypher-shell -u neo4j -p turismo2026 "RETURN 1" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep 3
}
docker cp "$raiz\grafo\rutas_sostenibles.cypher" neo4j-turismo:/var/lib/neo4j/import/rutas.cypher
docker exec neo4j-turismo cypher-shell -u neo4j -p turismo2026 --format plain -f /var/lib/neo4j/import/rutas.cypher
Write-Host "Listo. Navegador: http://localhost:7474 (neo4j / turismo2026)"
