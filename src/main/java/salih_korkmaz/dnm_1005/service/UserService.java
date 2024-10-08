package salih_korkmaz.dnm_1005.service;

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

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail(),user.getId().toString());
            return new LoginResponse(token, user.getEmail(), user.getId().toString()); // userId eklendi
        } else {
            throw new RuntimeException("Geçersiz kimlik bilgileri.");
        }
    }

    public LoginResponse signup(LoginRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException("Bu e-posta zaten kullanılıyor.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(),user.getId().toString());

        return new LoginResponse(token, user.getEmail(), user.getId().toString());
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    }
}
