package service;

public class TokenUtil {
    public static String getTokenFromEnv() {
        String token = System.getenv("TOKEN_API");
        if (token == null || token.isEmpty()) {
            System.out.println("Token not found in environment variables");
        }
        return token;
    }
}

