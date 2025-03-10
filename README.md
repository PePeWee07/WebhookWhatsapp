Install NPM:
- express
- axios
- dontenv
- typescript
- ts-node-dev
- postgres
- winston
- moment-timezone
- helmet
- express-rate-limit



## Metrics for period to: `<hora>` (width: `<tiempo>`)

| **Metric**                                              | **Description**                                                                                                                                                          |
|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **http.codes.200** / **http.codes.429**                 | Número de respuestas HTTP con esos códigos.<br>**200**: Éxito.<br>**429**: Demasiadas peticiones (rate limit).                                                         |
| **http.downloaded_bytes**                               | Total de bytes descargados durante el período.                                                                                                                         |
| **http.request_rate**                                   | Tasa de solicitudes por segundo durante ese intervalo.                                                                                                               |
| **http.requests**                                       | Número total de solicitudes enviadas en ese período.                                                                                                                   |
| **http.response_time**                                  | Estadísticas sobre el tiempo de respuesta (en milisegundos):<br> - *min*: Tiempo mínimo.<br> - *max*: Tiempo máximo.<br> - *mean*: Promedio.<br> - *median*: Valor central.<br> - *p95*: 95% de las respuestas estuvieron por debajo de este tiempo.<br> - *p99*: 99% de las respuestas estuvieron por debajo de este tiempo. |
| **http.response_time.2xx** / **http.response_time.4xx** | Estadísticas de tiempos de respuesta separadas por el tipo de código:<br> - *2xx*: Respuestas exitosas.<br> - *4xx*: Errores de cliente (por ejemplo, 429).      |
| **http.responses**                                      | Total de respuestas recibidas durante ese intervalo.                                                                                                                   |
| **vusers.created**                                      | Número de usuarios virtuales creados.                                                                                                                                   |
| **vusers.completed**                                    | Número de usuarios virtuales que completaron su escenario.                                                                                                              |
| **vusers.failed**                                       | Número de usuarios virtuales que fallaron.                                                                                                                               |
| **vusers.created_by_name.<scenario_name>**              | Número de usuarios virtuales creados para cada escenario (por ejemplo, "Prueba de Webhook POST").                                                                           |
| **vusers.session_length**                               | Estadísticas sobre la duración de la sesión de cada usuario virtual:<br> - *min*: Duración mínima.<br> - *max*: Duración máxima.<br> - *mean*: Duración promedio.<br> - *median*: Duración mediana.<br> - *p95*: Percentil 95.<br> - *p99*: Percentil 99.      |

---

## Summary Report

| **Metric**                                              | **Description**                                                                                                                                                          |
|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **http.codes.200** / **http.codes.429**                 | Totales de respuestas HTTP con esos códigos durante toda la prueba.                                                                                                     |
| **http.downloaded_bytes**                               | Total de bytes descargados durante la prueba.                                                                                                                          |
| **http.request_rate**                                   | Promedio de solicitudes por segundo durante la prueba.                                                                                                               |
| **http.requests**                                       | Número total de solicitudes enviadas durante la prueba.                                                                                                              |
| **http.response_time**                                  | Estadísticas generales de tiempos de respuesta (min, max, mean, median, p95, p99).                                                                                      |
| **vusers.completed**, **vusers.created**, **vusers.failed**, **vusers.session_length** | Estadísticas globales de los usuarios virtuales que participaron en la prueba.                                                                                            |

