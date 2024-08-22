package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.EvaloutionDTO;
import salih_korkmaz.dnm_1005.entity.Evaloution;
import salih_korkmaz.dnm_1005.entity.Harvest;

@Component
public class EvaloutionMapper {
    public EvaloutionDTO toDTO(Evaloution evaolution){
        EvaloutionDTO evaloutionDTO = new EvaloutionDTO();
        evaloutionDTO.setId(evaloutionDTO.getId());
        evaloutionDTO.setHarvestCondition(evaloutionDTO.getHarvestCondition());
        evaloutionDTO.setOverallRating(evaloutionDTO.getOverallRating());
        evaloutionDTO.setHarvestId(evaolution.getHarvest().getId());  //harvestId
        evaloutionDTO.setProductQuality(evaloutionDTO.getProductQuality());
        evaloutionDTO.setProductQuantity(evaloutionDTO.getProductQuantity());
        return evaloutionDTO;
    }
    public Evaloution toEntity(EvaloutionDTO evaloutionDTO){
        Evaloution evaloution = new Evaloution();

        if(evaloutionDTO.getId()!= null){
            evaloution.setId(evaloution.getId());
        }
        //Evalotion nesnesi Entity olarak set edilir.
        //? Kayıt işleminde kullanılır  toEntity.
        Harvest harvest = new Harvest();
        harvest.setId(evaloutionDTO.getHarvestId());
        evaloution.setHarvest(harvest);

        evaloution.setHarvestCondition(evaloutionDTO.getHarvestCondition());
        evaloution.setHarvestCondition(evaloutionDTO.getHarvestCondition());
        evaloution.setOverallRating(evaloutionDTO.getOverallRating());
        evaloution.setProductQuality(evaloutionDTO.getProductQuality());
        evaloution.setProductQuantity(evaloutionDTO.getProductQuantity());

        return evaloution;
    }
}
