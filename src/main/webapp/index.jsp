<%@page import="java.io.*"%>
<%@page import="service.WebhookClient"%>
<%@page import="service.TokenUtil"%>
<%
        /*
        * VERIFICACION DEL WEBHOOK
        */

        try {
            // TOKEN
            String token = TokenUtil.getTokenFromEnv();
            
            // Reto de Facebook
            String palabraReto = request.getParameter("hub.challenge");
            // Token de verificación = Token devuelve Facebook
            String tokenVerificacion = request.getParameter("hub.verify_token");

            if (token.equals(tokenVerificacion)) {
                out.print(palabraReto);
                return;
            } 

        } catch (Exception e) {
            out.print("Error: " + e.getMessage());
        }


        /*
        * RECEPCION DE MENSAJES
        */

        try {
            // Leemos los datos recibidos de WhatsApp
            ServletInputStream mServletInputStream = request.getInputStream();
            // Obtenemos el tamaño de los datos
            int tam = request.getContentLength();

            if (tam > 0) {
            // Obtenemos los datos en bytes
            byte[] httpInData = new byte[tam];
            int retVal = -1;
            StringBuilder stringBuilder = new StringBuilder();

            // Ciclo para leer los datos en bytes
            while ((retVal = mServletInputStream.read(httpInData)) != -1) {
                for (int i = 0; i < retVal; i++) {
                stringBuilder.append(Character.toString((char) httpInData[i]));
                }
            }

            // Convertimos el texto recibido
            String textoRecibidoWA = stringBuilder.toString();

            // Envio de mensaje a la API
            if (textoRecibidoWA.contains("contacts")) {
                WebhookClient.sendToApi(textoRecibidoWA);
            } 

            // Guardamos el texto en un archivo
            try {
                String archivo = application.getRealPath("/") + "\\texto.json";
                FileWriter fWriter = new FileWriter(archivo);
                fWriter.write(textoRecibidoWA);
                fWriter.close();
            } catch (IOException e) {
                out.print("Error: " + e.getMessage());
            }

            } else {
                out.print("No se recibieron datos.");
            }

        } catch (Exception e) {
            out.print("Error: " + e.getMessage());
        }
%>