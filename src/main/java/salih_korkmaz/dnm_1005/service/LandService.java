package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.mapper.LandMapper;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;
import salih_korkmaz.dnm_1005.repository.UserRepository;
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
    @Value("${file.upload-dir}")
    private String uploadDir;
    private final LandRepository landRepository;
    private final UserRepository userRepository;
    private final LocalityRepository localityRepository;
    private final LandMapper landMapper;

    public LandService(LandRepository landRepository, UserRepository userRepository, LocalityRepository localityRepository, LandMapper landMapper) {
        this.landRepository = landRepository;
        this.userRepository = userRepository;
        this.localityRepository = localityRepository;
        this.landMapper = landMapper;
    }

    public Land saveLand(LandDTO landDto, MultipartFile imageFile) {
        // Kullanıcı ve locality bulunur.
        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        Locality locality = localityRepository.findById(landDto.getLocalityId())
                .orElseThrow(() -> new RuntimeException("Mahalle/Köy bulunamadı."));

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
            User user = userRepository.findById(landDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            existingLand.setUser(user);
        }

        // Yerleşimi güncelleme işlemi
        if (landDto.getLocalityId() != null) {
            Locality locality = localityRepository.findById(landDto.getLocalityId())
                    .orElseThrow(() -> new RuntimeException("Lokasyon bulunamadı"));
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


    public List<LandDTO> getLandsByUser(Long userId) {
        List<Land> lands = landRepository.findByUserId(userId);
        return lands.stream().map(landMapper::toDTO).collect(Collectors.toList());
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
