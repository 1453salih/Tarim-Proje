package salih_korkmaz.dnm_1005.service;



import salih_korkmaz.dnm_1005.dto.LoginRequest;
import salih_korkmaz.dnm_1005.dto.LoginResponse;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUser(request.getUser());

        if (userOptional.isPresent() && userOptional.get().getPassword().equals(request.getPassword())) {
            return new LoginResponse("Login successful");
        } else {
            return new LoginResponse("Login failed");
        }
    }

    public LoginResponse signup(LoginRequest request) {
        if (userRepository.findByUser(request.getUser()).isPresent()) {
            return new LoginResponse("User already exists");
        } else {
            User newUser = new User();
            newUser.setUser(request.getUser());
            newUser.setPassword(request.getPassword());
            userRepository.save(newUser);
            return new LoginResponse("Signup successful");
        }
    }
}

