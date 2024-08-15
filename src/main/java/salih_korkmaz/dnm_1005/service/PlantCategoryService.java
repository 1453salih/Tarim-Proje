package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.entity.PlantCategory;
import salih_korkmaz.dnm_1005.repository.PlantCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlantCategoryService {

    @Autowired
    private PlantCategoryRepository plantCategoryRepository;

    public List<PlantCategoryDTO> getAllCategories() {
        return plantCategoryRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private PlantCategoryDTO convertToDTO(PlantCategory category) {
        PlantCategoryDTO dto = new PlantCategoryDTO();
        dto.setId(category.getId());
        dto.setCategoryName(category.getCategoryName());
        return dto;
    }
}
