package salih_korkmaz.dnm_1005.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        // Arazi kullanılabilir alanı almak için arazi bilgisi alınır.
        LandDTO land = landService.getLandById(sowingDto.getLandId());

        // Ekim yapılacak alan kadar clayableLand azaltılır.
        double sowingField = sowingDto.getSowingField();

        // Mevcut clayableLand değerinden ekim alanını çıkar.
        landService.subtractFromClayableLand(land.getId(), sowingField);

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
    public Page<SowingDTO> getSowingsByUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // UserService'den kullanıcıyı alır.
        User user = userService.getAuthenticatedUser();

        Pageable pageable = PageRequest.of(page, size);

        // Kullanıcı ID'sine göre ekimleri paginasyonla getirir.
        return sowingService.getSowingsByUser(user.getId(), pageable);
    }

    @GetMapping("/{sowingId}/hasat-durumu")
    public ResponseEntity<Boolean> hasatDurumu(@PathVariable Long sowingId) {
        boolean hasatEdildiMi = harvestService.existsBySowingId(sowingId);
        return ResponseEntity.ok(hasatEdildiMi);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSowing(@PathVariable Long id) {
        sowingService.deleteSowing(id);
        return ResponseEntity.noContent().build();
    }

}
