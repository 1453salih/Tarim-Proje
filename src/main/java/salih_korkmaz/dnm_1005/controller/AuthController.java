package salih_korkmaz.dnm_1005.controller;

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
        if (jwt != null && jwtUtil.validateToken(jwt, jwtUtil.extractEmail(jwt))) {  // extractUsername yerine extractEmail
            String email = jwtUtil.extractEmail(jwt);  // username yerine email kullandım
            return ResponseEntity.ok(new LoginResponse(jwt, email));
        }

        // Login işlemi
        LoginResponse response = userService.login(request);
        String token = response.getToken();

        // Yeni HTTP-Only cookie oluşturlur.
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 gün
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }




    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody LoginRequest request) {
        LoginResponse response = userService.signup(request);
        String token = response.getToken();

        // Token'ın oluşturulup oluşturulmadığını kontrol edin
        System.out.println("Generated Token in Signup: " + token);

        // Yeni HTTP-Only cookie oluşturlur.
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 gün
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Boolean>> validateToken(@CookieValue(name = "jwt", required = false) String jwt) {
        Map<String, Boolean> response = new HashMap<>();

        if (jwt != null && jwtUtil.validateToken(jwt, jwtUtil.extractEmail(jwt))) {
            response.put("isValid", true);
            return ResponseEntity.ok(response);
        }

        response.put("isValid", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(EmailAlreadyInUseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleEmailAlreadyInUseException(EmailAlreadyInUseException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return errorResponse;
    }


}
