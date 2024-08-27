package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.LoginRequest;
import salih_korkmaz.dnm_1005.dto.LoginResponse;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.exception.EmailAlreadyInUseException;
import salih_korkmaz.dnm_1005.repository.UserRepository;
import salih_korkmaz.dnm_1005.util.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            //? Her girişte yeni bir token oluşturur
            String token = jwtUtil.generateToken(user.getEmail());
            return new LoginResponse(token, user.getId().toString());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }



    public LoginResponse signup(LoginRequest request) {
        // E-posta adresinin kullanımda olup olmadığını kontrol eder
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("This email is already in use");
        }

        // Yeni bir kullanıcı oluşturur ve kaydeder
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // Token oluşturulur
        String token = jwtUtil.generateToken(user.getEmail());

        // Kullanıcıya ait token ve userId'yi içeren bir yanıt döndürülür
        return new LoginResponse(token, user.getId().toString());
    }




    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return findByEmail(email);
    }



}
