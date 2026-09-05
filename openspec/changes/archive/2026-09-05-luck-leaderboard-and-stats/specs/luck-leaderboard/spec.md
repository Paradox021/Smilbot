## Purpose

Proporciona a los usuarios de Discord la capacidad de consultar el ranking (Top 5) de los jugadores con mayor o menor suerte en las tiradas de cartas gacha.

## ADDED Requirements

### Requirement: Consulta de Top Suerte Gacha
El sistema SHALL permitir a los usuarios consultar el Top 5 de jugadores con mayor suerte histórica en tiradas gacha mediante el comando `.top luck` o el alias `.topluck`.

#### Scenario: Visualización exitosa del Top 5 más afortunados
- **WHEN** un usuario ejecuta `.top luck` o `.topluck`
- **THEN** el bot consulta la API con `order=desc`, `limit=5` y `minPulls=20` y responde con un Embed mostrando los 5 jugadores con mayor suerte, sus posiciones, porcentajes delta y desgloses de rarezas.

#### Scenario: Visualización del Top 5 más desafortunados
- **WHEN** un usuario ejecuta `.top luck worst` o `.topluck worst`
- **THEN** el bot consulta la API con `order=asc`, `limit=5` y `minPulls=20` y responde con un Embed destacando a los jugadores más desafortunados.

#### Scenario: No hay jugadores calificados
- **WHEN** ningún usuario en la base de datos alcanza el umbral de 20 tiradas gacha
- **THEN** el bot responde con un mensaje amigable indicando que aún no hay suficientes jugadores calificados (se requieren mínimo 20 tiradas).
