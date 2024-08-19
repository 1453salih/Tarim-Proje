package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.mapper.PlantCategoryMapper;
import salih_korkmaz.dnm_1005.repository.PlantCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantCategoryService {


    private final PlantCategoryRepository plantCategoryRepository;
    private final PlantCategoryMapper plantCategoryMapper;

    public PlantCategoryService(PlantCategoryRepository plantCategoryRepository, PlantCategoryMapper plantCategoryMapper) {
        this.plantCategoryRepository = plantCategoryRepository;
        this.plantCategoryMapper = plantCategoryMapper;
    }

    public List<PlantCategoryDTO> getAllCategories() {
        return plantCategoryRepository.findAll().stream().map(plantCategoryMapper::toDTO).collect(Collectors.toList());
    }

}
