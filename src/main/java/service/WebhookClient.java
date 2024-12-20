package service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

import java.util.logging.*;

import service.Utils;
public class WebhookClient {
    private static final Logger LOGGER = Logger.getLogger(WebhookClient.class.getName());

    static {
        setupLogger();
    }

    // ======================================================
    //   Incializa el logger para el controlador de Webhook
    // ======================================================
    private static void setupLogger() {
        try {
            FileHandler fileHandler = new FileHandler(Utils.getPathLogs(), true);
            fileHandler.setEncoding("UTF-8");
            fileHandler.setFormatter(new SimpleFormatter());
            LOGGER.addHandler(fileHandler);
            LOGGER.setLevel(Level.INFO);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error al tratar de iniciar Logs de Webhook controlador", e);
        }
    }

    // ======================================================
    //   Envia la respuesta al Back-end
    // ======================================================
    public static void sendToApi(String jsonData) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(Utils.getEndpointBackEnd()))
                    .header("Content-Type", "application/json")
                    .header(Utils.getApiKeyHeader(), Utils.getApiKey())
                    .POST(BodyPublishers.ofString(jsonData))
                    .build();

            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            LOGGER.info("Response status: " + response.statusCode());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error al tratar de enviar respuesta al Back-end", e);
        }
    }
}

