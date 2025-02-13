# Iniciar Proyecto

```powershell
docker-compose up -d
```

### Enviroments
```bash
PATH_WEBHOOK_CONTROLER_LOGS="logs/webhookController.log"
URL_BACKEND="http://whatsapp-api-cloud-app:8082/api/v1/whatsapp/receive"
TOKEN_API="my-secure-token-api-webhook"
API_KEY_HEADER="X-API-KEY"
API_KEY="my-secure-api-key"
MESSAGE_PATH="/usr/local/tomcat/webapps/miapp/messages"
```

## Ejemplo de enviar mensaje JSON

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "382874548252970",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551765358",
              "phone_number_id": "435688539630512"
            },
            "statuses": [
              {
                "id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAERgSOTJENTUyNUEwMUQ2Nzg0RkEzAA==",
                "status": "delivered",
                "timestamp": "1729519912",
                "recipient_id": "593983439289",
                "conversation": {
                  "id": "c7bbacc15af2d66ab76640854b65fa83",
                  "origin": { "type": "service" }
                },
                "pricing": {
                  "billable": true,
                  "pricing_model": "CBP",
                  "category": "service"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

### Glosario de JSON recividos
| Campo                     | Descripción                                                             |
|---------------------------|-------------------------------------------------------------------------|
| `object`                  | Tipo de objeto, en este caso, una cuenta de negocio de WhatsApp.        |
| `entry`                   | Array que contiene los objetos de eventos.                              |
| `id`                      | ID de la cuenta de WhatsApp Business asociada al evento.                |
| `changes`                 | Array de cambios que representan los eventos de mensajes.               |
| `value`                   | Contiene los detalles del evento de mensaje.                            |
| `messaging_product`       | Producto de mensajería, especifica que es WhatsApp.                     |
| `metadata`                | Metadatos relacionados con el evento, como el número de teléfono.      |
| `display_phone_number`    | Número de teléfono visible asociado con la cuenta de WhatsApp Business. |
| `phone_number_id`         | ID único del número de teléfono de WhatsApp Business.                   |
| `statuses`                | Array de objetos que describen el estado de los mensajes enviados.      |
| `id` (dentro de `statuses`) | ID único del mensaje de WhatsApp.                                       |
| `status`                  | Estado del mensaje, como `delivered`.                                   |
| `timestamp`               | Marca de tiempo UNIX del evento.                                        |
| `recipient_id`            | ID de WhatsApp del destinatario del mensaje.                            |
| `conversation`            | Información sobre la conversación a la que pertenece este mensaje.      |
| `id` (dentro de `conversation`) | ID único de la conversación.                                       |
| `origin`                  | Origen del mensaje, indicando cómo se inició la conversación.           |
| `type` (dentro de `origin`) | Tipo de origen, como `service`.                                         |
| `pricing`                 | Detalles sobre la facturación del mensaje.                              |
| `billable`                | Indica si el mensaje es facturable.                                     |
| `pricing_model`           | Modelo de precios aplicado al mensaje, como `CBP`.                      |
| `category`                | Categoría del servicio bajo el modelo de precios, como `service`.       |
| `field`                   | Campo que indica el tipo de cambio, en este caso, `messages`.           |

## Ejemplo de recivir mensaje JSON

### Glosario de JSON recividos
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "382874548252970",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551765358",
              "phone_number_id": "435688539630512"
            },
            "contacts": [
              { "profile": { "name": "PePe" }, "wa_id": "593983439289" }
            ],
            "messages": [
              {
                "from": "593983439289",
                "id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAEhgWM0VCMENFRDNEM0FDQURGQzg4REZCNAA=",
                "timestamp": "1729519964",
                "text": { "body": "muy bien" },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

| Campo                     | Descripción                                                             |
|---------------------------|-------------------------------------------------------------------------|
| `object`                  | Tipo de objeto, en este caso, una cuenta de negocio de WhatsApp.        |
| `entry`                   | Array que contiene los objetos de eventos.                              |
| `id`                      | ID de la cuenta de WhatsApp Business asociada al evento.                |
| `changes`                 | Array de cambios que representan los eventos de mensajes.               |
| `value`                   | Contiene los detalles del evento de mensaje.                            |
| `messaging_product`       | Producto de mensajería, especifica que es WhatsApp.                     |
| `metadata`                | Metadatos relacionados con el evento, como el número de teléfono.      |
| `display_phone_number`    | Número de teléfono visible asociado con la cuenta de WhatsApp Business. |
| `phone_number_id`         | ID único del número de teléfono de WhatsApp Business.                   |
| `contacts`                | Array de objetos que representan los contactos involucrados.            |
| `profile`                 | Perfil del contacto involucrado en el mensaje.                          |
| `name`                    | Nombre del contacto, como aparece en WhatsApp.                          |
| `wa_id`                   | ID de WhatsApp del contacto.                                            |
| `messages`                | Array de objetos que describen los mensajes entrantes.                  |
| `from`                    | ID de WhatsApp del remitente del mensaje.                               |
| `id`                      | ID único del mensaje de WhatsApp.                                       |
| `timestamp`               | Marca de tiempo UNIX cuando se envió el mensaje.                        |
| `text`                    | Objeto que contiene el cuerpo del mensaje.                              |
| `body`                    | Texto del mensaje recibido.                                             |
| `type`                    | Tipo de mensaje, como `text`.                                           |
| `field`                   | Campo que indica el tipo de cambio, en este caso, `messages`.           |

## Mas ejemplos: 
    https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#mensajes-recibidos