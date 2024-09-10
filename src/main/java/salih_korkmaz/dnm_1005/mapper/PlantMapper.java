package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.PlantDTO;
import salih_korkmaz.dnm_1005.entity.Plant;


@Component
public class PlantMapper {
    public PlantDTO toDTO(Plant plant) {
        PlantDTO plantDTO = new PlantDTO();
        plantDTO.setId(plant.getId());
        plantDTO.setName(plant.getName());
        plantDTO.setImage(plant.getImage());
        plantDTO.setYieldPerSquareMeter(plant.getYieldPerSquareMeter());

        if (plant.getPlantCategory() != null) {
            plantDTO.setCategoryName(plant.getPlantCategory().getCategoryName());
        }

        return plantDTO;
    }
}
