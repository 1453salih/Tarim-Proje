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
        evaluationDTO.setWeatherCondition(evaluation.getWeatherCondition());
        evaluationDTO.setFertilisation(evaluation.getFertilisation());
        evaluationDTO.setIrrigation(evaluation.getIrrigation());
        evaluationDTO.setSpraying(evaluation.getSpraying());
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

        evaluation.setWeatherCondition(evaluationDTO.getWeatherCondition());
        evaluation.setFertilisation(evaluationDTO.getFertilisation());
        evaluation.setIrrigation(evaluationDTO.getIrrigation());
        evaluation.setSpraying(evaluationDTO.getSpraying());
        evaluation.setProductQuality(evaluationDTO.getProductQuality());
        evaluation.setProductQuantity(evaluationDTO.getProductQuantity());

        return evaluation;
    }
}
