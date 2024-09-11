package salih_korkmaz.dnm_1005.controller;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.LoginRequest;
import salih_korkmaz.dnm_1005.dto.LoginResponse;
import salih_korkmaz.dnm_1005.exception.EmailAlreadyInUseException;
import salih_korkmaz.dnm_1005.service.UserService;
import salih_korkmaz.dnm_1005.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, @CookieValue(name = "jwt", required = false) String jwt) {
        if (jwt != null && jwtUtil.validateToken(jwt, jwtUtil.extractEmail(jwt))) {
            String email = jwtUtil.extractEmail(jwt);
            String userId = userService.findByEmail(email).getId().toString();
            return ResponseEntity.ok(new LoginResponse(jwt, email, userId));
        }

        // Login işlemi
        LoginResponse response = userService.login(request);
        String token = response.getToken();
        String refreshToken = jwtUtil.generateRefreshToken(response.getEmail());

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60) // 1 saat
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshJwt", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 gün
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }


    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody LoginRequest request) {
        LoginResponse response = userService.signup(request);
        String token = response.getToken();
        String refreshToken = jwtUtil.generateRefreshToken(response.getEmail());


        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60) // 1 saat
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshJwt", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 gün
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT ve refresh token silmek için cookie süresini sıfırlıyoruz
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshJwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body("Logged out");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@CookieValue(name = "refreshJwt", required = false) String refreshToken) {
        if (refreshToken != null && jwtUtil.validateRefreshToken(refreshToken, jwtUtil.extractEmail(refreshToken))) {
            String email = jwtUtil.extractEmail(refreshToken);
            String newAccessToken = jwtUtil.generateToken(email);
            String userId = userService.findByEmail(email).getId().toString();

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", newAccessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(60 * 60) // 1 saat
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new LoginResponse(newAccessToken, email, userId));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }


    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@CookieValue(name = "jwt", required = false) String jwt) {
        Map<String, Boolean> response = new HashMap<>();

        if (jwt != null) {
            try {
                // Token geçerliliği kontrol ediliyor
                String email = jwtUtil.extractEmail(jwt);
                if (jwtUtil.validateToken(jwt, email)) {
                    response.put("isValid", true);
                    return ResponseEntity.ok(response);
                }
            } catch (ExpiredJwtException e) {

                response.put("isValid", false);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            } catch (Exception e) {
                // Token geçersiz ya da hata varsa.
                response.put("isValid", false);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }

        // Geçersiz veya boş token için cookie temizleniyor
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        response.put("isValid", false);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }


    @ExceptionHandler(EmailAlreadyInUseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleEmailAlreadyInUseException(EmailAlreadyInUseException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return errorResponse;
    }
}
