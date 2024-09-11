package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.PlantDTO;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.repository.PlantRepository;

import java.util.List;
import java.util.stream.Collectors;
import salih_korkmaz.dnm_1005.mapper.PlantMapper;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final PlantMapper plantMapper;

    public PlantService(PlantRepository plantRepository, PlantMapper plantMapper) {
        this.plantRepository = plantRepository;
        this.plantMapper = plantMapper;
    }

    public Plant savePlant(Plant plant) {
        return plantRepository.save(plant);
    }

    //? getAllPlants metodu, veritabanındaki tüm Plant entity'lerini getirir ve
    //? her birini PlantMapper kullanarak PlantDTO nesnesine dönüştürür.
    //? Sonuç olarak, PlantDTO nesnelerinin bir listesini döndürür.

    public List<PlantDTO> getAllPlants() {
        return plantRepository.findAll().stream().map(plantMapper::toDTO).collect(Collectors.toList());
    }

    public List<PlantDTO> getPlantsByCategory(Long categoryId) {
        return plantRepository.findByPlantCategoryId(categoryId)
                .stream()
                .map(plantMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PlantDTO getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bitki bulunamadı"));
        return plantMapper.toDTO(plant);
    }

    public Plant findPlantById(Long id) {
        return plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bitki bulunamadı"));
    }

}
