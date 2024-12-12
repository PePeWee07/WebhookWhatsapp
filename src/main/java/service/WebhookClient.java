package service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

import java.util.logging.*;

import io.github.cdimascio.dotenv.Dotenv;

public class WebhookClient {
    private static final Logger LOGGER = Logger.getLogger(WebhookClient.class.getName());
    private static final Dotenv dotenv = Dotenv.load();

    static {
        setupLogger();
    }

    private static void setupLogger() {
        try {
            FileHandler fileHandler = new FileHandler(dotenv.get("PATH_WEBHOOK_CONTROLER_LOGS"), true);
            fileHandler.setEncoding("UTF-8");
            fileHandler.setFormatter(new SimpleFormatter());
            LOGGER.addHandler(fileHandler);
            LOGGER.setLevel(Level.INFO);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error al tratar de iniciar Logs de Webhook controlador", e);
        }
    }

    public static void sendToApi(String jsonData) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(dotenv.get("URL_BACKEND")))
                    .header("Content-Type", "application/json")
                    .POST(BodyPublishers.ofString(jsonData))
                    .build();

            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            LOGGER.info("Response status: " + response.statusCode());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error al tratar de enviar respuesta al Back-end", e);
        }
    }
}

