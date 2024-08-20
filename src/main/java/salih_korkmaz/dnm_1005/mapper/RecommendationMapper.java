package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.dto.RecommendationDTO;
import salih_korkmaz.dnm_1005.entity.Recommendation;

@Component
public class RecommendationMapper {

    public RecommendationDTO toDTO(Recommendation recommendation) {
        if (recommendation == null) {
            return null;
        }

        RecommendationDTO recommendationDTO = new RecommendationDTO();
        recommendationDTO.setId(recommendation.getId());
        recommendationDTO.setSuccesRate(recommendation.getSuccesRate());
        recommendationDTO.setHarvestPeriod(recommendation.getHarvestPeriod());
        recommendationDTO.setSowingPeriod(recommendation.getSowingPeriod());

        if (recommendation.getPlant() != null) {
            recommendationDTO.setPlantId(recommendation.getPlant().getId());
            recommendationDTO.setPlantName(recommendation.getPlant().getName());
            recommendationDTO.setPlantImage(recommendation.getPlant().getImage());
        }

        if (recommendation.getLocality() != null) {
            LocalityDTO localityDTO = new LocalityDTO();
            localityDTO.setCode(recommendation.getLocality().getCode());
            localityDTO.setName(recommendation.getLocality().getName());
            localityDTO.setSlug(recommendation.getLocality().getSlug());
            localityDTO.setType(recommendation.getLocality().getType());
            localityDTO.setDistrictCode(recommendation.getLocality().getDistrict().getCode());

            recommendationDTO.setLocality(localityDTO);
        }



        return recommendationDTO;
    }
}
