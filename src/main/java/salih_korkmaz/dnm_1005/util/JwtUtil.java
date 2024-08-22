package salih_korkmaz.dnm_1005.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Güvenli bir secret key oluşturuluyor HS256 türünde
    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Bu metodu artık e-posta üzerinden çalışacak şekilde düzenliyoruz
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject); // getSubject metodu e-posta bilgisini taşıyacak
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Kullanıcı adı yerine e-posta kullanarak token oluşturuyoruz
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email); // subject artık e-posta olacak
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // subject e-posta olarak set ediliyor
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 365))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Token doğrulamasında e-posta kullanılıyor
    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token); // Kullanıcı adı yerine e-posta çıkarılıyor
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
}
