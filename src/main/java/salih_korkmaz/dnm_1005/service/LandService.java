
package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.mapper.LandMapper;
import salih_korkmaz.dnm_1005.repository.LandRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LandService {
    private final LocationService locationService;
    @Value("${file.upload-dir}")
    private String uploadDir;
    private final LandRepository landRepository;
    private final LandMapper landMapper;
    private final UserService userService;

    public LandService(LandRepository landRepository, LandMapper landMapper, UserService userService, LocationService locationService) {
        this.landRepository = landRepository;
        this.landMapper = landMapper;
        this.userService = userService;
        this.locationService = locationService;
    }

    public Land saveLand(LandDTO landDto, MultipartFile imageFile) {
        // Kullanıcı ve locality bulunur.
        User user = userService.findById(landDto.getUserId());

        Locality locality = locationService.findById(landDto.getLocalityId());

        // DTO'dan entity'ye dönüşüm.
        Land land = landMapper.toEntity(landDto, user, locality);

        // Resim dosyası varsa işlenir, yoksa varsayılan resim atanır.
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = uploadImage(imageFile);
            land.setImage(imageUrl);
        } else {
            land.setImage("../../src/assets/DefaultImage/defaultLand.png");
        }

        // Entity kaydedilir.
        return landRepository.save(land);
    }


    public Land updateLand(Long id, @Valid LandDTO landDto, MultipartFile file) {
        // Mevcut araziyi al.
        Land existingLand = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));

        // Mevcut arazi büyüklüğünü kaydet.
        double currentLandSize = existingLand.getLandSize();

        // Yeni arazi büyüklüğünü güncelle.
        existingLand.setName(landDto.getName());
        existingLand.setLandSize(landDto.getLandSize());

        // Kullanıcıyı güncelleme işlemi
        if (landDto.getUserId() != null) {
            User user = userService.findById(landDto.getUserId());
            existingLand.setUser(user);
        }

        // Yerleşimi güncelleme işlemi
        if (landDto.getLocalityId() != null) {
            Locality locality = locationService.findById(landDto.getLocalityId());
            existingLand.setLocality(locality);
        }

        // Görsel dosya yükleme işlemi
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadImage(file);
            existingLand.setImage(imageUrl);
        }

        // Arazi büyüklüğündeki değişikliği kontrol eder
        double newLandSize = landDto.getLandSize();
        double sizeDifference = newLandSize - currentLandSize;

        if (sizeDifference != 0) {
            double currentClayableLand = existingLand.getClayableLand();

            // Eğer arazi büyüklüğü artıyorsa ekilebilir alanı artırır.
            if (sizeDifference > 0) {
                existingLand.setClayableLand(currentClayableLand + sizeDifference);
            }
            // Eğer arazi büyüklüğü azalıyorsa, ekilebilir alanı azaltır.
            else if (sizeDifference < 0) {
                double updatedClayableLand = currentClayableLand + sizeDifference; // Bu durumda sizeDifference negatif olacak
                existingLand.setClayableLand(Math.max(0, updatedClayableLand)); // 0'dan küçük olamaz
            }
        }

        // Arazinin güncellenmiş halini kaydet.
        return landRepository.save(existingLand);
    }


    public void addToClayableLand(Long landId, double amount) {
        Land land = landRepository.findById(landId).orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));

        // Mevcut clayableLand değerini al ve artır.
        double currentClayableLand = land.getClayableLand();
        double updatedClayableLand = currentClayableLand + amount;

        // Güncellenen clayableLand değerini ayarla.
        land.setClayableLand(updatedClayableLand);

        // Yeni değeri kaydet.
        landRepository.save(land);
    }

    public void subtractFromClayableLand(Long landId, double amount) {
        Land land = landRepository.findById(landId).orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));

        // Mevcut clayableLand değerini al ve azalt.
        double currentClayableLand = land.getClayableLand();
        double updatedClayableLand = currentClayableLand - amount;

        // Güncellenen clayableLand değerini ayarla.
        land.setClayableLand(updatedClayableLand);

        // Yeni değeri kaydet.
        landRepository.save(land);
    }

    public LandDTO getLandById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));

        return landMapper.toDTO(land);
    }


    public Page<LandDTO> getFilteredLands(String landName, String cityName, String districtName, Double minSize, Double maxSize, Pageable pageable) {
        Specification<Land> spec = Specification.where(null);

        if (landName != null && !landName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + landName.toLowerCase() + "%"));
        }
        if (cityName != null && !cityName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("location").get("cityName")), "%" + cityName.toLowerCase() + "%"));
        }
        if (districtName != null && !districtName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("location").get("districtName")), "%" + districtName.toLowerCase() + "%"));
        }
        if (minSize != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("landSize"), minSize));
        }
        if (maxSize != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("landSize"), maxSize));
        }
        return landRepository.findAll(spec, pageable).map(landMapper::toDTO);
    }

    public Land findLandById(Long id) {
        return landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));
    }

    public Locality getLocalityByLandId(Long landId) {
        return landRepository.findById(landId)
                .map(Land::getLocality)
                .orElseThrow(() -> new IllegalArgumentException("Geçersiz arazi ID: " + landId));
    }

    public String uploadImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename(); // Benzersiz dosya adı.
            Path path = Paths.get(uploadDir + File.separator + fileName);// kaydedilecek yol.
            Files.createDirectories(path.getParent());//Dizin mevcut değilse dizini oluşturur.
            Files.write(path, file.getBytes());
            return "../../src/assets/Lands/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Görüntü depolanamadı", e);
        }
    }


    @Transactional
    public void deleteLand(Long id) {
        Land land = landRepository.findById(id).orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));
        landRepository.delete(land);  // Arazi silinir
    }

}
