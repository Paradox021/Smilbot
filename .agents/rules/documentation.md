# Directrices Obligatorias de Documentación en `docs/`

Siempre que se implemente una nueva característica, se modifique un comando existente o se altere la arquitectura o integración con servicios externos, es **estrictamente obligatorio** actualizar la documentación en `docs/`.

---

## 🧭 Mapa de Destinos según el Tipo de Cambio

| Tipo de Cambio | Archivo o Carpeta a Actualizar | Qué se debe incluir |
| :--- | :--- | :--- |
| **Comando nuevo o modificado** | `docs/commands/<categoria>.md` | Nombre, alias, descripción, permisos requeridos, parámetros/argumentos y ejemplos de uso. |
| **Lógica de negocio o mecánica** | `docs/features/<sistema>.md` | Flujos de datos, reglas de negocio, fórmulas (probabilidades, cooldowns, rachas, etc.). |
| **Integración / Endpoints backend** | `docs/integrations/backend-api.md` | Métodos HTTP, rutas de endpoints, headers requeridos, payload de request y response esperada. |
| **Componentes de UI / Arquitectura** | `docs/architecture/` | Patrones de diseño, controladores de eventos, manejo de embeds/botones/modales. |
| **Nuevo archivo en `docs/`** | `docs/README.md` | Si se crea una nueva categoría o archivo en `docs/`, incluirlo en el mapa del README principal. |

---

## 📋 Checklist de Documentación (Pre-finalización)

Antes de dar una tarea, respuesta o cambio por concluido, el agente debe verificar:
- [ ] ¿Se modificaron firmas de comandos o nuevos comandos? → Actualizar `docs/commands/`.
- [ ] ¿Cambió algún cálculo, cooldown o regla de juego? → Actualizar `docs/features/`.
- [ ] ¿Se consumió un nuevo endpoint o cambiaron los parámetros de API? → Actualizar `docs/integrations/backend-api.md`.
- [ ] ¿Se requirió una nueva variable de entorno? → Documentar en `.env.sample` y en la sección correspondiente de `docs/`.
- [ ] ¿Se agregaron archivos nuevos a `docs/`? → Registrar en `docs/README.md`.
