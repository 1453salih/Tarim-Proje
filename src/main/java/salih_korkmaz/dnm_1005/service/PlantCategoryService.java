package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.entity.PlantCategory;
import salih_korkmaz.dnm_1005.mapper.PlantCategoryMapper;
import salih_korkmaz.dnm_1005.repository.PlantCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantCategoryService {

    private final PlantCategoryRepository plantCategoryRepository;
    private final PlantCategoryMapper plantCategoryMapper;

    public PlantCategoryService(PlantCategoryRepository plantCategoryRepository,
                                PlantCategoryMapper plantCategoryMapper) {
        this.plantCategoryRepository = plantCategoryRepository;
        this.plantCategoryMapper = plantCategoryMapper;
    }

    public List<PlantCategoryDTO> getAllCategories() {
        return plantCategoryRepository.findAll().stream()
                .map(plantCategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PlantCategoryDTO getPlantCategoryById(Long id) {
        PlantCategory plantCategory = plantCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bitki kategorisi bulunamadı"));
        return plantCategoryMapper.toDTO(plantCategory);
    }

    public PlantCategoryDTO getPlantCategoryByPlantId(Long plantId) {
        PlantCategory plantCategory = plantCategoryRepository.findByPlant_Id(plantId)
                .orElseThrow(() -> new RuntimeException("Bitki ID için Bitki Kategorisi Bulunamadı:" + plantId));
        return plantCategoryMapper.toDTO(plantCategory);
    }
}
