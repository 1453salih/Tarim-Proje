package salih_korkmaz.dnm_1005.filter;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import salih_korkmaz.dnm_1005.util.JwtUtil;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String jwt = null;
        String refreshToken = null;

        // JWT'yi Cookie'den al
        Cookie jwtCookie = WebUtils.getCookie(request, "jwt");
        if (jwtCookie != null) {
            jwt = jwtCookie.getValue();
        }

        // Refresh token'ı Cookie'den al
        Cookie refreshTokenCookie = WebUtils.getCookie(request, "refreshJwt");
        if (refreshTokenCookie != null) {
            refreshToken = refreshTokenCookie.getValue();
        }

        String email = null;

        if (jwt != null) {
            try {
                email = jwtUtil.extractEmail(jwt); // Token'dan email'i çıkar
            } catch (ExpiredJwtException e) {
                // Token expired durumunda refresh token kullanarak yeni bir access token oluşturulur.
                if (refreshToken != null && jwtUtil.validateRefreshToken(refreshToken, jwtUtil.extractEmail(refreshToken))) {
                    email = jwtUtil.extractEmail(refreshToken);
                    String userId = jwtUtil.extractUserId(refreshToken);
                    System.out.println(userId);//Kaldır
                    String newAccessToken = jwtUtil.generateToken(email,userId);

                    // Yeni JWT cookie'si oluştur
                    ResponseCookie newJwtCookie = ResponseCookie.from("jwt", newAccessToken)
                            .httpOnly(true)
                            .secure(false)
                            .path("/")
                            .maxAge(60 * 60) // 1 saat
                            .build();

                    response.setHeader(HttpHeaders.SET_COOKIE, newJwtCookie.toString());

                    // Access token yenilenip kullanıma hazır, email tekrar alındı
                } else {
                    // Refresh token da geçerli değilse, işlemi durdur ve hata döndür
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    return;
                }
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        chain.doFilter(request, response);
    }
}
