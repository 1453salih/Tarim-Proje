package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.UserRepository;
import salih_korkmaz.dnm_1005.service.LandService;
import salih_korkmaz.dnm_1005.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/lands")
@CrossOrigin(origins = "http://localhost:5173")
public class LandController {

    @Autowired
    private LandService landService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PostMapping
    public Land createLand(@RequestBody LandDTO landDto) {
        if (landDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null in controller");
        }
        return landService.saveLand(landDto);
    }


    @GetMapping
    public List<LandDTO> getLandsByUser() {

        // UserService'den kullanıcıyı alır
        User user = userService.getAuthenticatedUser();

        // Kullanıcı ID'sine göre arazileri getirir
        return landService.getLandsByUser(user.getId());
    }

    @GetMapping("/detail/{id}")
    public LandDTO getLandById(@PathVariable Long id) {
        return landService.getLandById(id);
    }

    @PutMapping("/update/{id}")
    public Land updateLand(@PathVariable Long id, @RequestBody LandDTO landDto) {
        // LandService'i kullanarak araziyi günceller
        return landService.updateLand(id, landDto);
    }
    @GetMapping("/{landId}/locality")
    public Locality getLocalityByLandId(@PathVariable Long landId) {
        return landService.getLocalityByLandId(landId);
    }


}
