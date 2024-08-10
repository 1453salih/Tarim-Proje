package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandService {

    @Autowired
    private LandRepository landRepository;

    @Autowired
    private UserRepository userRepository;

    public Land saveLand(Land land) {
        // Kullanıcıyı userId ile bul
        User user = userRepository.findById(land.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Land nesnesine User'ı set et
        land.setUser(user);

        // Land'ı kaydet
        return landRepository.save(land);
    }

    public List<LandDTO> getAllLands() {
        return landRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private LandDTO convertToDto(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setCity(land.getCity());
        landDto.setDistrict(land.getDistrict());
        landDto.setVillage(land.getVillage());
        landDto.setUserId(land.getUser().getId());
        return landDto;
    }
}
