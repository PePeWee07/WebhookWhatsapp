<%@page import="java.io.*"%>
<%@page import="service.WebhookClient"%>
<%@page import="service.TokenUtil"%>
<%@page import="java.util.Random"%>
<%@ page import="org.apache.log4j.Logger" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%

    Logger logger = Logger.getLogger(getClass());

    /*
     * VERIFICACION DEL WEBHOOK
     */
    try {
        String token = TokenUtil.getTokenFromEnv();
        String palabraReto = request.getParameter("hub.challenge");
        String tokenVerificacion = request.getParameter("hub.verify_token");

        if (token.equals(tokenVerificacion)) {
            response.setStatus(HttpServletResponse.SC_OK);
            logger.info("Webhook verificado correctamente.");
            return;
        }
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        logger.error("Error: " + e.getMessage());
        return;
    }

    /*
     * RECEPCION DE MENSAJES
     */
    try {
        response.setStatus(HttpServletResponse.SC_OK);

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

            if (textoRecibidoWA.contains("contacts")) {
                WebhookClient.sendToApi(textoRecibidoWA);

                String wa_id = new org.json.JSONObject(textoRecibidoWA)
                    .getJSONArray("entry")
                    .getJSONObject(0)
                    .getJSONArray("changes")
                    .getJSONObject(0)
                    .getJSONObject("value")
                    .getJSONArray("contacts")
                    .getJSONObject(0)
                    .getString("wa_id");

                try {
                    String nameFile =  "msg-" + wa_id.toString() + ".txt";

                    String folder = application.getRealPath("/messages");

                    File path = new File(folder);

                    if (!path.exists()) {
                        path.mkdirs();
                    }

                    String file = folder + File.separator + nameFile;
                    FileWriter fWriter = null;
                    try {
                        fWriter = new FileWriter(file, true);
                        fWriter.write(textoRecibidoWA + "\n");
                    } catch (Exception e) {
                        logger.error("Error al guardar el mensaje: " + e.getMessage());
                    } finally {
                        if (fWriter != null) {
                            fWriter.close();
                        }
                    }
                } catch (Exception e) {
                    logger.error("Error al guardar el mensaje: " + e.getMessage());
                }
            } 

        } else {
            logger.info("No se recibió ningún mensaje.");
        }

    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        logger.error("Error: " + e.getMessage());
    }
%>
