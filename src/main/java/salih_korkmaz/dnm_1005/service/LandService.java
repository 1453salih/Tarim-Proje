package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.dto.LocationDTO;
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
        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Locality locality = localityRepository.findById(landDto.getLocalityId())
                .orElseThrow(() -> new RuntimeException("Locality not found"));

        Land land = new Land();
        land.setName(landDto.getName());
        land.setLandSize(landDto.getLandSize());
        land.setUser(user);
        land.setLocality(locality);

        if (imageFile != null && !imageFile.isEmpty()) {
            // Resmi kayder ve URL'yi alır
            String imageUrl = uploadImage(imageFile);
            land.setImage(imageUrl);
        }

        return landRepository.save(land);
    }

    public Land updateLand(Long id, @Valid LandDTO landDto, MultipartFile file) {
        Land existingLand = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));

        existingLand.setName(landDto.getName());
        existingLand.setLandSize(landDto.getLandSize());

        if (landDto.getUserId() != null) {
            User user = userRepository.findById(landDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingLand.setUser(user);
        }

        if (landDto.getLocalityId() != null) {
            Locality locality = localityRepository.findById(landDto.getLocalityId())
                    .orElseThrow(() -> new RuntimeException("Locality not found"));
            existingLand.setLocality(locality);
        }

        // Dosya yükleme işlemi
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadImage(file); // Görsel yüklenir ve URL döndürülür
            existingLand.setImage(imageUrl); // Görsel URL'si Land objesine set edilir
        }

        return landRepository.save(existingLand);
    }

    public List<LandDTO> getAllLands() {
        return landRepository.findAll().stream().map(land -> {
            LandDTO landDTO = landMapper.toDTO(land);
            LocationDTO locationDTO = new LocationDTO(
                    land.getLocality().getDistrict().getCity().getName(),
                    land.getLocality().getDistrict().getName(),
                    land.getLocality().getName(),
                    land.getLocality().getDistrict().getCity().getCode(),  // City code
                    land.getLocality().getDistrict().getCode(),  // District code
                    land.getLocality().getCode()  // Locality code
            );
            landDTO.setLocation(locationDTO);
            return landDTO;
        }).collect(Collectors.toList());
    }

    public LandDTO getLandById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));

        LandDTO landDTO = landMapper.toDTO(land);

        // LocationDTO'yu manuel olarak doldurma işlemi
        LocationDTO locationDTO = new LocationDTO(
                land.getLocality().getDistrict().getCity().getName(),
                land.getLocality().getDistrict().getName(),
                land.getLocality().getName(),
                land.getLocality().getDistrict().getCity().getCode(),  // City code
                land.getLocality().getDistrict().getCode(),  // District code
                land.getLocality().getCode()  // Locality code
        );
        landDTO.setLocation(locationDTO);

        return landDTO;
    }

    public List<LandDTO> getLandsByUser(Long userId) {
        List<Land> lands = landRepository.findByUserId(userId);
        return lands.stream().map(land -> {
            LandDTO landDTO = landMapper.toDTO(land);
            LocationDTO locationDTO = new LocationDTO(
                    land.getLocality().getDistrict().getCity().getName(),
                    land.getLocality().getDistrict().getName(),
                    land.getLocality().getName(),
                    land.getLocality().getDistrict().getCity().getCode(),  // City code
                    land.getLocality().getDistrict().getCode(),  // District code
                    land.getLocality().getCode()  // Locality code
            );
            landDTO.setLocation(locationDTO);
            return landDTO;
        }).collect(Collectors.toList());
    }

    public Land findLandById(Long id) {
        return landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));
    }

    public Locality getLocalityByLandId(Long landId) {
        return landRepository.findById(landId)
                .map(Land::getLocality)
                .orElseThrow(() -> new IllegalArgumentException("Invalid land ID: " + landId));
    }
    public String uploadImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + File.separator + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return "../../src/assets/Lands/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

}
