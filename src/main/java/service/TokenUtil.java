package service;
import io.github.cdimascio.dotenv.Dotenv;

public class TokenUtil {
    private static final Dotenv dotenv = Dotenv.load();

    public static String getTokenFromEnv() {
        String token = dotenv.get("TOKEN_API");
        if (token == null || token.isEmpty()) {
            System.out.println("Token de Webhook no encontrado");
        }
        return token;
    }
}

