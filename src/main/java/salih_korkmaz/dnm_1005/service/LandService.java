package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.repository.LandRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LandService {

    @Autowired
    private LandRepository landRepository;

    public Land saveLand(Land land) {
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
        return landDto;
    }
}
