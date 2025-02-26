<%@ page import="org.apache.logging.log4j.Logger" %>
<%@ page import="org.apache.logging.log4j.LogManager" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.Random" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="com.ucacue.app.service.WebhookClient" %>
<%@ page import="com.ucacue.app.service.Utils" %>
<%@ page import="com.ucacue.app.service.message.MessageService" %>
<%@ page import="com.ucacue.app.model.entity.MessageEntity" %>
<%
    Logger logger = LogManager.getLogger(getClass());

    /*
     * VERIFICACION DEL WEBHOOK
     */
    try {
        String token = Utils.getTokenFromEnv();
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
                stringBuilder.append(new String(httpInData, 0, retVal));
            }

            String textoRecibidoWA = stringBuilder.toString();

            if (textoRecibidoWA.contains("contacts")) {
                WebhookClient.sendToApi(textoRecibidoWA);

                JSONObject json = new JSONObject(textoRecibidoWA);
                JSONObject entry = json.getJSONArray("entry").getJSONObject(0);
                JSONObject change = entry.getJSONArray("changes").getJSONObject(0);
                JSONObject value = change.getJSONObject("value");
                String wa_id = value.getJSONArray("contacts").getJSONObject(0).getString("wa_id");
                JSONObject message = value.getJSONArray("messages").getJSONObject(0);
                String messageId = message.getString("id");
                String timestamp = message.getString("timestamp");
                String type = message.getString("type");
                String content = message.getJSONObject("text").getString("body");

                long ts = Long.parseLong(timestamp);

                String nameFile = "msg-" + wa_id + ".txt";
                String folder = Utils.getMessageFolder();
                String formattedDate = Utils.convertTimeStamp(ts);
                if (folder == null) {
                    folder = application.getRealPath("/messages");
                }

                File path = new File(folder);
                if (!path.exists()) {
                    path.mkdirs();
                }

                String file = folder + File.separator + nameFile;
                try (FileWriter fWriter = new FileWriter(file, true)) {
                    fWriter.write(formattedDate + textoRecibidoWA + "\n");
                } catch (Exception e) {
                    logger.error("Error al guardar log del mensaje: " + e.getMessage());
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
