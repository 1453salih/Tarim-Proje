package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.EvaluationDataDTO;
import salih_korkmaz.dnm_1005.entity.Evaluation;

@Component
public class EvaluationDataMapper {
    public EvaluationDataDTO toDTO(Evaluation evaluation) {
        EvaluationDataDTO evaluationDataDTO = new EvaluationDataDTO();
        evaluationDataDTO.setId(evaluation.getId());
        evaluationDataDTO.setProductQuantity(evaluation.getProductQuantity());
        evaluationDataDTO.setPlantImageUrl(evaluation.getHarvest().getSowing().getPlant().getImage());
        evaluationDataDTO.setPlantName(evaluation.getHarvest().getSowing().getPlant().getName());
        evaluationDataDTO.setHarvestId(evaluation.getHarvest().getId());
        return evaluationDataDTO;
    }
}
