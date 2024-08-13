package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.PlantRepository;
import salih_korkmaz.dnm_1005.repository.SowingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SowingService {

    @Autowired
    private SowingRepository sowingRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private LandRepository landRepository;

    public SowingDTO saveSowing(SowingDTO sowingDto) {
        Plant plant = plantRepository.findById(sowingDto.getPlantId())
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        Land land = landRepository.findById(sowingDto.getLandId())
                .orElseThrow(() -> new RuntimeException("Land not found"));

        Sowing sowing = new Sowing();
        sowing.setPlant(plant);
        sowing.setLand(land);
        sowing.setSowingDate(sowingDto.getSowingDate());

        Sowing savedSowing = sowingRepository.save(sowing);

        return convertToDto(savedSowing);  // Sowing nesnesini SowingDTO'ya dönüştürüp döndürün
    }


    public List<SowingDTO> getAllSowings() {
        return sowingRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private SowingDTO convertToDto(Sowing sowing) {
        SowingDTO sowingDto = new SowingDTO();
        sowingDto.setId(sowing.getId());
        sowingDto.setPlantId(sowing.getPlant().getId());
        sowingDto.setLandId(sowing.getLand().getId());
        sowingDto.setSowingDate(sowing.getSowingDate());
        return sowingDto;
    }
}