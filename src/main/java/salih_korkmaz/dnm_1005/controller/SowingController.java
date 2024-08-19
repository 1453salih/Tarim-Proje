package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.service.SowingService;
import salih_korkmaz.dnm_1005.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/sowings")
@CrossOrigin(origins = "http://localhost:5173")
public class SowingController {

    private final SowingService sowingService;
    private final UserService userService;

    public SowingController(SowingService sowingService, UserService userService) {
        this.sowingService = sowingService;
        this.userService = userService;
    }

    @PostMapping
    public SowingDTO createSowing(@RequestBody SowingDTO sowingDto) {
        return sowingService.saveSowing(sowingDto);
    }

    @GetMapping
    public List<SowingDTO> getSowingsByUser() {

        // UserService'den kullanıcıyı alır.
        User user = userService.getAuthenticatedUser();

        // Kullanıcı ID'sine göre ekimleri getirir.
        return sowingService.getSowingsByUser(user.getId());
    }
}
