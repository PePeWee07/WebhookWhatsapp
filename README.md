# Iniciar Proyecto
```cmd
mvn tomcat7:run
```

# Configuración del Proyecto

Este proyecto utiliza variables de entorno para gestionar configuraciones sensibles como los tokens de autenticación.

## Configuración de Variables de Entorno

Para que el proyecto funcione correctamente, es necesario configurar una variable de entorno que almacene el token utilizado para la autenticación de los webhooks.

## Cómo Configurar

### Windows

1. Abre el Panel de Control.
2. Navega a Sistema y seguridad > Sistema > Configuración avanzada del sistema.
3. Haz clic en Variables de entorno.
4. En Variables del sistema, haz clic en Nueva.
5. Introduce el nombre de la variable, por ejemplo, `TOKEN_API`.
6. Introduce el valor del token.
7. Haz clic en OK para guardar los cambios.

#### Alternativa Powershell

```powershell
$env:TOKEN_API = "TU_TOKEN"
echo $env:TOKEN_API
```

#### Alternativa CMD

```cmd
set TOKEN_API=TU_TOKEN
echo %TOKEN_API%
```

### Linux/Mac

Para configurar la variable de entorno en sistemas basados en Linux, puedes agregarla a tu archivo `.bashrc` o `.profile`, dependiendo de tu shell.

```bash
export TOKEN_API="tu_token_aquí"
```

## Glosario de JSON recividos

### Ejemplo de Mensaje Saliente JSON

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

### Ejemplo de Mensaje Entrante JSON

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

### Ejemplo de racion a un mensaje
- El siguiente es un ejemplo de un mensaje de reacción recibido de parte de un cliente. No recibirás este webhook si el mensaje al que reaccionó el cliente tiene más de 30 días.

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
                "id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAEhgWM0VCMDdBMEQ2QUVFNTBDNDA5NjFBQQA=",
                "timestamp": "1729708958",
                "type": "reaction",
                "reaction": {
                  "message_id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAEhgWM0VCMEUzMUM3RUEwRjI4RTdGMUY4RgA=",
                  "emoji": "\ud83d\ude22"
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

### Ejemplo de mensaje multimedia
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
                "id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAEhgWM0VCMDczRDhGRjQzMEE3QjIwQTNFNgA=",
                "timestamp": "1729709150",
                "type": "image",
                "image": {
                  "mime_type": "image/jpeg",
                  "sha256": "76BcgW2dCgcN34E8bqTaM0DRLvpsuyrUbt0SR4pz9iU=",
                  "id": "1076724067255163"
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

### Ejemplo de mensaje Sticker
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
                "id": "wamid.HBgMNTkzOTgzNDM5Mjg5FQIAEhgWM0VCMENDNUNCMzFERTFFQzlERjAxMgA=",
                "timestamp": "1729709268",
                "type": "sticker",
                "sticker": {
                  "mime_type": "image/webp",
                  "sha256": "FxEleR33uQpynY3h/zHzZedjMEmVK/UEdfKGFWaUZnk=",
                  "id": "1606242173110184",
                  "animated": false
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

### Mesnsaje desconocido
- Es posible recibir una notificación de devolución de llamada en respuesta a un mensaje desconocido. Por ejemplo, un cliente podría enviarte un mensaje no compatible, como un mensaje que desaparece (en cuyo caso, le notificaremos al cliente que no se admite el tipo de mensaje).
```json
```