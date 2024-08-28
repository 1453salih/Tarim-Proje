package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.entity.Evaluation;
import salih_korkmaz.dnm_1005.entity.Harvest;

@Component
public class EvaluationMapper {
    public EvaluationDTO toDTO(Evaluation evaluation){
        EvaluationDTO evaluationDTO = new EvaluationDTO();
        evaluationDTO.setId(evaluation.getId());
        evaluationDTO.setHarvestCondition(evaluation.getHarvestCondition());
        evaluationDTO.setOverallRating(evaluation.getOverallRating());
        evaluationDTO.setHarvestId(evaluation.getHarvest().getId());  //harvestId
        evaluationDTO.setProductQuality(evaluation.getProductQuality());
        evaluationDTO.setProductQuantity(evaluation.getProductQuantity());
        return evaluationDTO;
    }

    public Evaluation toEntity(EvaluationDTO evaluationDTO){
        Evaluation evaluation = new Evaluation();

        if(evaluationDTO.getId() != null){
            evaluation.setId(evaluationDTO.getId());
        }

        Harvest harvest = new Harvest();
        harvest.setId(evaluationDTO.getHarvestId());
        evaluation.setHarvest(harvest);

        evaluation.setHarvestCondition(evaluationDTO.getHarvestCondition());
        evaluation.setOverallRating(evaluationDTO.getOverallRating());
        evaluation.setProductQuality(evaluationDTO.getProductQuality());
        evaluation.setProductQuantity(evaluationDTO.getProductQuantity());

        return evaluation;
    }
}
