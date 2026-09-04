# AION: retención y privacidad de leads

**Objetivo.** AION almacena únicamente los datos operativos necesarios para gestionar solicitudes, consentimientos, exclusiones y seguimientos autorizados. Los campos de contacto y las notas se consideran información de cliente y deben tratarse como confidenciales.

## Retención operativa

| Registro | Retención predeterminada | Acción al vencer |
|---|---:|---|
| Lead sin conversión | 12 meses desde la última actividad | Anonimizar nombre, email, teléfono y notas; conservar métricas agregadas. |
| Lead ganado o perdido | 24 meses desde el cierre | Anonimizar los datos personales; conservar etapa y fechas para analítica agregada. |
| Opt-out | 24 meses desde la solicitud | Conservar únicamente un identificador de supresión y la fecha, para impedir nuevos envíos. |
| Notificaciones | 90 días desde su creación | Eliminar. |
| Plantillas y reglas de automatización | Hasta que el propietario las elimine | Eliminar junto con su configuración asociada. |

## Controles aplicados por la plataforma

El intake público utiliza una clave opaca por nicho y solo devuelve los metadatos mínimos para mostrar el formulario. Cada envío público registra la fuente y hora de consentimiento. Las automatizaciones se cancelan cuando no existe consentimiento, se recibe un opt-out, se solicita **needs human review**, o la oportunidad llega a las etapas terminales **Won** o **Lost**.

## Procedimiento para solicitudes del interesado

El propietario del nicho debe localizar el lead, activar el opt-out de inmediato cuando corresponda y, si se solicita borrado, anonimizarlos datos identificables sin alterar los indicadores agregados del embudo. Cualquier exportación de datos debe limitarse al nicho pertinente y mantenerse fuera de repositorios de código.

## Próxima automatización recomendada

Antes de producción, programar una tarea autenticada diaria que aplique estos plazos de anonimización. La tarea debe ejecutarse por nicho, registrar cuántos registros procesó y nunca eliminar la marca de supresión mientras esté vigente el periodo de 24 meses.
