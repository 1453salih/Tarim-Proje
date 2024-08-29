package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.EvaluationDetailsDTO;
import salih_korkmaz.dnm_1005.entity.*;

@Component
public class EvaluationDetailsMapper {
    public EvaluationDetailsDTO toDto(Evaluation evaluation) {
        Harvest harvest = evaluation.getHarvest();
        Sowing sowing = harvest.getSowing();
        Land land = sowing.getLand();
        Plant plant = sowing.getPlant();

        EvaluationDetailsDTO dto = new EvaluationDetailsDTO();
        dto.setEvaluationId(evaluation.getId());
        dto.setLandName(land.getName());
        dto.setLandImageUrl(land.getImage());
        dto.setPlantName(plant.getName());
        dto.setPlantImageUrl(plant.getImage());
        dto.setSowingDate(sowing.getSowingDate());
        dto.setHarvestDate(harvest.getHarvestDate());
        dto.setEvaluationDate(evaluation.getEvaluationDate());
        dto.setHarvestCondition(evaluation.getHarvestCondition());
        dto.setProductQuality(evaluation.getProductQuality());
        dto.setProductQuantity(evaluation.getProductQuantity());

        return dto;
    }
}
