package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.dto.LocationDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.mapper.LandMapper;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;
import salih_korkmaz.dnm_1005.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandService {

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

    public Land saveLand(LandDTO landDto) {
        User user = userRepository.findById(landDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Locality locality = localityRepository.findById(landDto.getLocalityId())
                .orElseThrow(() -> new RuntimeException("Locality not found"));

        Land land = new Land();
        land.setName(landDto.getName());
        land.setLandSize(landDto.getLandSize());
        land.setUser(user);
        land.setLocality(locality);

        return landRepository.save(land);
    }

    public Land updateLand(Long id, @Valid LandDTO landDto) {
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

        // LocationDTO'yu manuel olarak doldur
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
}
