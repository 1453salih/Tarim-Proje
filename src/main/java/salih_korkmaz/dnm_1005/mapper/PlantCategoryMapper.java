package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.entity.PlantCategory;

@Component
public class PlantCategoryMapper {
    public PlantCategoryDTO toDTO(PlantCategory plantCategory) {
        PlantCategoryDTO plantCategoryDTO = new PlantCategoryDTO();
        plantCategoryDTO.setId(plantCategory.getId());
        plantCategoryDTO.setCategoryName(plantCategory.getCategoryName());

        return plantCategoryDTO;
    }
}
