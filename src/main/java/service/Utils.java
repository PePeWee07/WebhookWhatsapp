package service;
import io.github.cdimascio.dotenv.Dotenv;

public class Utils {

    private static final Dotenv dotenv = Dotenv.load();

    // ======================================================
    //   Obtiene el token de Webhook 
    // ======================================================
    public static String getTokenFromEnv() {
        try {
            String token = dotenv.get("TOKEN_API");
            if (token == null || token.isEmpty()) {
                System.out.println("'TOKEN_API' de Webhook no encontrado");
            }
            return token;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }


    // ======================================================
    //   Obtiene el API KEY
    // ======================================================
    public static String getApiKey(){
        try {
            String apiKey = dotenv.get("API_KEY");
            if (apiKey == null || apiKey.isEmpty()) {
                System.out.println("'API_KEY' de back-end no encontrado");
            }
            return apiKey;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }


    // ======================================================
    //   Obtiene el Header del API KEY 
    // ======================================================
    public static String getApiKeyHeader(){
        try {
            String apiKeyHeader = dotenv.get("API_KEY_HEADER");
            if (apiKeyHeader == null || apiKeyHeader.isEmpty()) {
                System.out.println("'API_KEY_HEADER' de back-end no encontrado");
            }
            return apiKeyHeader;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    
    // ======================================================
    //   Obtiene el Path para logs
    // ======================================================
    public static String getPathLogs(){
        try {
            String path = dotenv.get("PATH_WEBHOOK_CONTROLER_LOGS");
            if (path == null || path.isEmpty()) {
                System.out.println("'PATH_WEBHOOK_CONTROLER_LOGS' de logs no encontrado");
            }
            return path;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }


    // ======================================================
    //   Obtiene ENDPOINT Back-end
    // ======================================================
    public static String getEndpointBackEnd(){
        try {
            String endPoint = dotenv.get("URL_BACKEND");
            if (endPoint == null || endPoint.isEmpty()) {
                System.out.println("'URL_BACKEND' de back-end no encontrado");
            }
            return endPoint;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    // ======================================================
    //   Obtener el folder del mensaje
    // ======================================================
    public static String getMessageFolder() {
        try {
            String folder = dotenv.get("MESSAGE_PATH");
            if (folder == null || folder.isEmpty()) {
                System.out.println("'MESSAGE_PATH' no encontrado");
            }
            return folder;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
