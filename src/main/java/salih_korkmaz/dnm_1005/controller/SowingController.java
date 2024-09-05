package salih_korkmaz.dnm_1005.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.service.HarvestService;
import salih_korkmaz.dnm_1005.service.LandService;
import salih_korkmaz.dnm_1005.service.SowingService;
import salih_korkmaz.dnm_1005.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/sowings")
@CrossOrigin(origins = "http://localhost:5173")
public class SowingController {

    private final SowingService sowingService;
    private final UserService userService;
    private final HarvestService harvestService;
    private final LandService landService;

    public SowingController(SowingService sowingService, UserService userService, HarvestService harvestService, LandService landService) {
        this.sowingService = sowingService;
        this.userService = userService;
        this.harvestService = harvestService;
        this.landService = landService;
    }

    @PostMapping
    public SowingDTO createSowing(@RequestBody SowingDTO sowingDto) {
        // Arazi kullanılabilir alanı güncellemek için alınır.
        LandDTO land = landService.getLandById(sowingDto.getLandId());

        // Ekilebilir alan hesaplanır.
        double remainingLand = land.getClayableLand() - sowingDto.getSowingField();

        // Sadece ClayableLand(Ekilebilir Alan) güncellenir.
        landService.updateClayableLand(land.getId(), remainingLand);

        // Ekim kaydı yapılır.
        return sowingService.saveSowing(sowingDto);
    }



    @GetMapping("/detail/{id}")
    public SowingDTO getSowingById(@PathVariable Long id) {
        return sowingService.getSowingById(id);
    }
    @PutMapping("/update/{id}")
    public Sowing updateSowing(@PathVariable Long id, @RequestBody SowingDTO sowingDto) {
        // LandService'i kullanarak araziyi günceller.
        return sowingService.updateSowing(id, sowingDto);
    }
    @GetMapping
    public List<SowingDTO> getSowingsByUser() {

        // UserService'den kullanıcıyı alır.
        User user = userService.getAuthenticatedUser();

        // Kullanıcı ID'sine göre ekimleri getirir.
        return sowingService.getSowingsByUser(user.getId());
    }
    @GetMapping("/{sowingId}/hasat-durumu")
    public ResponseEntity<Boolean> hasatDurumu(@PathVariable Long sowingId) {
        boolean hasatEdildiMi = harvestService.existsBySowingId(sowingId);
        return ResponseEntity.ok(hasatEdildiMi);
    }
}
