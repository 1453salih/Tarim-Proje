package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.EvaloutionDTO;
import salih_korkmaz.dnm_1005.entity.Evaloution;
import salih_korkmaz.dnm_1005.entity.Harvest;

@Component
public class EvaloutionMapper {
    public EvaloutionDTO toDTO(Evaloution evaloution){
        EvaloutionDTO evaloutionDTO = new EvaloutionDTO();
        evaloutionDTO.setId(evaloution.getId());
        evaloutionDTO.setHarvestCondition(evaloution.getHarvestCondition());
        evaloutionDTO.setOverallRating(evaloution.getOverallRating());
        evaloutionDTO.setHarvestId(evaloution.getHarvest().getId());  //harvestId
        evaloutionDTO.setProductQuality(evaloution.getProductQuality());
        evaloutionDTO.setProductQuantity(evaloution.getProductQuantity());
        return evaloutionDTO;
    }

    public Evaloution toEntity(EvaloutionDTO evaloutionDTO){
        Evaloution evaloution = new Evaloution();

        if(evaloutionDTO.getId() != null){
            evaloution.setId(evaloutionDTO.getId());
        }

        Harvest harvest = new Harvest();
        harvest.setId(evaloutionDTO.getHarvestId());
        evaloution.setHarvest(harvest);

        evaloution.setHarvestCondition(evaloutionDTO.getHarvestCondition());
        evaloution.setOverallRating(evaloutionDTO.getOverallRating());
        evaloution.setProductQuality(evaloutionDTO.getProductQuality());
        evaloution.setProductQuantity(evaloutionDTO.getProductQuantity());

        return evaloution;
    }
}
