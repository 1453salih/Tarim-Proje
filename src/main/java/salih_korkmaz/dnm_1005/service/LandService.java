package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;
import salih_korkmaz.dnm_1005.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandService {

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocalityRepository localityRepository;

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
        return landRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public LandDTO getLandById(Long id) {
        Land land = landRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Land not found"));
        return convertToDto(land);
    }

    public List<LandDTO> getLandsByUser(Long userId) {
        List<Land> lands = landRepository.findByUserId(userId);
        return lands.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private LandDTO convertToDto(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setUserId(land.getUser().getId());
        landDto.setLocalityId(land.getLocality().getCode());
        return landDto;
    }

    public Locality findLocalityById(Long localityId) {
        return localityRepository.findById(localityId)
                .orElseThrow(() -> new RuntimeException("Locality not found"));
    }
}
