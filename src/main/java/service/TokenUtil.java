package service;
import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.log4j.Logger;

public class TokenUtil {
    private static final Logger logger = LoggerFactory.getLogger(TokenUtil.class);

    private static final Dotenv dotenv = Dotenv.load();

    public static String getTokenFromEnv() {
        try {
            String token = dotenv.get("TOKEN_API");
            if (token == null || token.isEmpty()) {
                System.out.println("Token de Webhook no encontrado");
                logger.error("Token de Webhook no encontrado");
            }
            return token;
        } catch (Exception e) {
            logger.error("Error al obtener el token de Webhook", e);
            return null;
        }
    }
}

