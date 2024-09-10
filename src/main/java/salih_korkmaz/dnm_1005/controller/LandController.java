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
import salih_korkmaz.dnm_1005.service.LandService;
import salih_korkmaz.dnm_1005.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/lands")
@CrossOrigin(origins = "http://localhost:5173")//adresinden gelen isteklere izin verir
public class LandController {

    private final LandService landService;
    private final UserService userService;

    public LandController(LandService landService, UserService userService) {
        this.landService = landService;
        this.userService = userService;
    }

    // Arazi oluşturma ve görsel yükleme, landDto ve  MultipartFile alır.
    @PostMapping
    public ResponseEntity<LandDTO> createLand(@RequestPart("land") LandDTO landDto,
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // Kullanıcı kimliği kontrol edilir
        if (landDto.getUserId() == null) {
            throw new IllegalArgumentException("Controller'da Kullanıcı Kimliği null olmamalıdır");
        }

        // saveLand metoduna kaydedilmek için gönderilir
        Land land = landService.saveLand(landDto, file);

        // Arazi kaydedildikten sonra, getLandById metodu ile kaydedilen arazi bilgisi geri alınır
        LandDTO savedLandDto = landService.getLandById(land.getId());
        return new ResponseEntity<>(savedLandDto, HttpStatus.CREATED);
    }


    @GetMapping
    public List<LandDTO> getLandsByUser() {
        // UserService'den oturum açmış kullanıcıyı alır.
        User user = userService.getAuthenticatedUser();

        // Kullanıcı ID'sine göre arazileri getirir.
        return landService.getLandsByUser(user.getId());
    }

    @GetMapping("/detail/{id}")
    public LandDTO getLandById(@PathVariable Long id) {
        return landService.getLandById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LandDTO> updateLand(@PathVariable Long id,
                                              @RequestPart("land") LandDTO landDto,//Multipart içindeki land'ı alır ve Land Dto'ya çevirir.
                                              @RequestPart(value = "file", required = false) MultipartFile file) {
        // LandService'i kullanarak araziyi günceller.
        Land updatedLand = landService.updateLand(id, landDto, file);

        //Güncellenen kaydı alır dto'ya çevirir ve istemciye geri döndürür.
        LandDTO updatedLandDto = landService.getLandById(updatedLand.getId());

        //Güncellenen arazi bilgileri (updatedLandDto), HTTP 200 (OK) durum kodu ile birlikte istemciye geri döndürülür.
        return new ResponseEntity<>(updatedLandDto, HttpStatus.OK);
    }


    @GetMapping("/{landId}/locality") //Url okunurluğu açısından bu şekilde yazıldı.
    public Locality getLocalityByLandId(@PathVariable Long landId) {
        return landService.getLocalityByLandId(landId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLand(@PathVariable Long id) { //Yanıt dönmeyeceği için ? koyuldu.
        landService.deleteLand(id);  // Arazi silinir, ekim verileri korunur.
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
