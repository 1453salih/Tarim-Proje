package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Sowing;
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

    public Sowing saveSowing(Sowing sowing){
        Plant plant = plantRepository.findById(sowing.getPlant().getId())
                .orElseThrow(() -> new RuntimeException(("user not found")));


        sowing.setPlant(plant);

        return sowingRepository.save(sowing);
    }
    public List<SowingDTO> getAllLands() {
        return sowingRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }
    private SowingDTO convertToDto (Sowing sowing) {
        SowingDTO sowingDto = new SowingDTO();
        sowingDto.setId(sowing.getId());
        sowingDto.setSowingDate(sowing.getSowingdDate());
        sowingDto.setPlantId(sowing.getPlant().getId());
        sowingDto.setLandId(sowing.getLand().getId());
        return sowingDto;
    }

}
