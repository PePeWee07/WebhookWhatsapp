<%@page import="java.io.*"%>
<%@page import="service.WebhookClient"%>
<%@page import="service.TokenUtil"%>
<%@page import="java.util.Random"%>
<%
    /*
     * VERIFICACION DEL WEBHOOK
     */
    try {
        String token = TokenUtil.getTokenFromEnv();
        String palabraReto = request.getParameter("hub.challenge");
        String tokenVerificacion = request.getParameter("hub.verify_token");

        if (token.equals(tokenVerificacion)) {
            response.setStatus(HttpServletResponse.SC_OK);
            out.print(palabraReto);
            return;
        }
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("Error: " + e.getMessage());
        return;
    }

    /*
     * RECEPCION DE MENSAJES
     */
    try {
        // Confirmar recepción con HTTP 200 OK inmediatamente
        response.setStatus(HttpServletResponse.SC_OK);
        out.flush();

        // Leer los datos del cuerpo de la solicitud
        ServletInputStream mServletInputStream = request.getInputStream();
        int tam = request.getContentLength();

        if (tam > 0) {
            byte[] httpInData = new byte[tam];
            int retVal;
            StringBuilder stringBuilder = new StringBuilder();

            while ((retVal = mServletInputStream.read(httpInData)) != -1) {
                for (int i = 0; i < retVal; i++) {
                    stringBuilder.append((char) httpInData[i]);
                }
            }

            String textoRecibidoWA = stringBuilder.toString();

            // Procesar el mensaje recibido
            if (textoRecibidoWA.contains("contacts")) {
                WebhookClient.sendToApi(textoRecibidoWA);

                // Guardar el mensaje en un archivo
                try {
                    String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    StringBuilder nombreArchivo = new StringBuilder("msg-");
                    Random rnd = new Random();
                    for (int i = 0; i < 16; i++) {
                        nombreArchivo.append(caracteres.charAt(rnd.nextInt(caracteres.length())));
                    }
                    String archivoNombre = nombreArchivo.toString() + ".json";

                    String carpeta = application.getRealPath("/messages");
                    File carpetaDirectorio = new File(carpeta);
                    if (!carpetaDirectorio.exists()) {
                        carpetaDirectorio.mkdirs();
                    }

                    String archivo = carpeta + File.separator + archivoNombre;
                    FileWriter fWriter = null;
                    try {
                        fWriter = new FileWriter(archivo);
                        fWriter.write(textoRecibidoWA);
                    } catch (IOException e) {
                        out.print("Error al guardar el mensaje: " + e.getMessage());
                    } finally {
                        if (fWriter != null) {
                            try {
                                fWriter.close();
                            } catch (IOException e) {
                                out.print("Error al cerrar el archivo: " + e.getMessage());
                            }
                        }
                    }
                } catch (IOException e) {
                    // Log del error
                    out.print("Error al guardar el mensaje: " + e.getMessage());
                }
            } else {
                out.print("No se envió el mensaje a la API-Springboot.");
            }
        } else {
            out.print("No se recibieron datos.");
        }
    } catch (Exception e) {
        out.print("Error: " + e.getMessage());
    }
%>
