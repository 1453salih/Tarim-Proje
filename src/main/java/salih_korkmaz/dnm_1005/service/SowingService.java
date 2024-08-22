package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.mapper.SowingMapper;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.SowingRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class SowingService {

    private final SowingRepository sowingRepository;
    private final PlantService plantService;
    private final LandService landService;
    private final SowingMapper sowingMapper;

    public SowingService(SowingRepository sowingRepository, PlantService plantService, LandService landService, SowingMapper sowingMapper, LandRepository landRepository) {
        this.sowingRepository = sowingRepository;
        this.plantService = plantService;
        this.landService = landService;
        this.sowingMapper = sowingMapper;
    }

    public SowingDTO saveSowing(SowingDTO sowingDto) {
        Plant plant = plantService.findPlantById(sowingDto.getPlantId());  // Plant nesnesi döndürülüyor
        Land land = landService.findLandById(sowingDto.getLandId());  // Aynı şekilde Land için de eklenebilir

        Sowing sowing = sowingMapper.toEntity(sowingDto);
        sowing.setPlant(plant);
        sowing.setLand(land);

        Sowing savedSowing = sowingRepository.save(sowing);
        return sowingMapper.toDto(savedSowing);
    }
    public Sowing updateSowing (Long id, @Valid SowingDTO sowingDto) {
       Sowing existingSowing = sowingRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("Sowing not found"));

       existingSowing.setSowingField(sowingDto.getSowingField());
       existingSowing.setSowingType(sowingDto.getSowingType());
       existingSowing.setSowingDate(sowingDto.getSowingDate());

        if (sowingDto.getLandId() != null) {
            Land land = Optional.ofNullable(landService.findLandById(sowingDto.getLandId()))
                    .orElseThrow(() -> new RuntimeException("Land not found"));
            existingSowing.setLand(land);
        }

        if(sowingDto.getPlantId() != null) {
            Plant plant = Optional.ofNullable(plantService.findPlantById(sowingDto.getPlantId()))
                    .orElseThrow(() -> new RuntimeException("Plant not found"));
            existingSowing.setPlant(plant);
        }

        return sowingRepository.save(existingSowing);
    }




    public List<SowingDTO> getAllSowings() {
        return sowingRepository.findAll().stream()
                .map(sowingMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<SowingDTO> getSowingsByUser(Long userId) {
        List<Sowing> sowings = sowingRepository.findByUserId(userId);
        return sowings.stream()
                .map(sowingMapper::toDto)
                .collect(Collectors.toList());
    }
    public SowingDTO getSowingById(Long id) {
        Sowing sowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sowing not found"));
        return sowingMapper.toDto(sowing);
    }

    public Sowing findSowingById(Long sowingId) {
        return sowingRepository.findById(sowingId)
                .orElseThrow(() -> new RuntimeException("Sowing not found"));
    }
}
