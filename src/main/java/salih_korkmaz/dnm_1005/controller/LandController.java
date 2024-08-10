package salih_korkmaz.dnm_1005.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.UserRepository;
import salih_korkmaz.dnm_1005.service.LandService;

import java.util.List;


@RestController
@RequestMapping("/lands")
@CrossOrigin(origins = "http://localhost:5173")
public class LandController {

    @Autowired
    private LandService landService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Land createLand(@RequestBody Land land) {
        // Kullanıcıyı userId ile bul
        User user = userRepository.findById(land.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Land nesnesine User'ı set et
        land.setUser(user);

        // Land'ı kaydet
        return landService.saveLand(land);
    }

    @GetMapping
    public List<LandDTO> getAllLands() {
        return landService.getAllLands();
    }

    @GetMapping("/detail/{id}")
    public LandDTO getLandById(@PathVariable Long id) {
        return landService.getLandById(id);
    }


}
