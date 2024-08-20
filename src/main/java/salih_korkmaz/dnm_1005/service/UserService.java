package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.LoginRequest;
import salih_korkmaz.dnm_1005.dto.LoginResponse;
import salih_korkmaz.dnm_1005.entity.User;
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
        User user = userRepository.findByUser(request.getUser())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Her girişte yeni bir token oluştur
            String token = jwtUtil.generateToken(user.getUser());
            return new LoginResponse(token, user.getId());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }


    public LoginResponse signup(LoginRequest request) {
        User user = new User();
        user.setUser(request.getUser());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUser());
        return new LoginResponse(token, user.getId());
    }

    public User findByUsername(String username) {
        return userRepository.findByUser(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return findByUsername(username);
    }


}
