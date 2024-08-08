package salih_korkmaz.dnm_1005.controller;

import salih_korkmaz.dnm_1005.dto.LoginRequest;
import salih_korkmaz.dnm_1005.dto.LoginResponse;
import salih_korkmaz.dnm_1005.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/signup")
    public LoginResponse signup(@RequestBody LoginRequest request) {
        return userService.signup(request);
    }


}
