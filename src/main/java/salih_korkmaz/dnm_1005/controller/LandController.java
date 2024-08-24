package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    // Arazi oluşturma ve görsel yükleme
    @PostMapping
    public ResponseEntity<LandDTO> createLand(@RequestPart("land") LandDTO landDto,
                                              @RequestPart("file") MultipartFile file) {
        if (landDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null in controller");
        }
        Land land = landService.saveLand(landDto, file);
        LandDTO savedLandDto = landService.getLandById(land.getId());
        return new ResponseEntity<>(savedLandDto, HttpStatus.CREATED);
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
    public ResponseEntity<LandDTO> updateLand(@PathVariable Long id,
                                              @RequestPart("land") LandDTO landDto,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // LandService'i kullanarak araziyi günceller
        Land updatedLand = landService.updateLand(id, landDto, file);
        LandDTO updatedLandDto = landService.getLandById(updatedLand.getId());
        return new ResponseEntity<>(updatedLandDto, HttpStatus.OK);
    }

    @GetMapping("/{landId}/locality")
    public Locality getLocalityByLandId(@PathVariable Long landId) {
        return landService.getLocalityByLandId(landId);
    }

}
