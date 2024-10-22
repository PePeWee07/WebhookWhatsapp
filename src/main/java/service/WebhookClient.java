package service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

import java.util.logging.*;

public class WebhookClient {
    private static final Logger LOGGER = Logger.getLogger(WebhookClient.class.getName());

    static {
        setupLogger();
    }

    private static void setupLogger() {
        try {
            FileHandler fileHandler = new FileHandler("logs/webhook.log", true);
            fileHandler.setEncoding("UTF-8");
            fileHandler.setFormatter(new SimpleFormatter());
            LOGGER.addHandler(fileHandler);
            LOGGER.setLevel(Level.INFO);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error setting up file handler", e);
        }
    }

    public static void sendToApi(String jsonData) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/v1/whatsapp/receive"))
                    .header("Content-Type", "application/json")
                    .POST(BodyPublishers.ofString(jsonData))
                    .build();

            HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
            LOGGER.info("Response status: " + response.statusCode());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error sending data to API", e);
        }
    }
}

