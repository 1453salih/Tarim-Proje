package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.dto.RecommendationDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Recommendation;
import salih_korkmaz.dnm_1005.mapper.RecommendationMapper;
import salih_korkmaz.dnm_1005.repository.RecommendationRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final RecommendationMapper recommendationMapper;
    private final LocationService locationService;

    public RecommendationService(RecommendationRepository recommendationRepository, RecommendationMapper recommendationMapper, LocationService locationService) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationMapper = recommendationMapper;
        this.locationService = locationService;
    }

    public List<RecommendationDTO> getRecommendationsByLocalityCode(Long localityCode) {
        Locality locality = locationService.findById(localityCode);
        return recommendationRepository.findByLocality(locality).stream()
                .map(recommendationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<Recommendation> getRecommendationsByLocality(Locality locality) {
        return recommendationRepository.findByLocality(locality);
    }

    public Optional<Recommendation> getRecommendationByPlantAndLocality(Plant plant, Locality locality) {
        return recommendationRepository.findByPlantAndLocality(plant, locality);
    }

    // Tavsiyenin başarı oranını güncelleyen işlev
    public void updateSuccessRate(EvaluationDTO evaluationDTO, Harvest harvest, double currentSuccessRate) {
        double adjustment = calculateSuccessRate(evaluationDTO, harvest, currentSuccessRate);

        Optional<Recommendation> optionalRecommendation = recommendationRepository.findByPlantAndLocality(
                harvest.getSowing().getPlant(), harvest.getSowing().getLand().getLocality()
        );

        if (optionalRecommendation.isPresent()) {
            Recommendation recommendation = optionalRecommendation.get();
            double updatedSuccessRate = recommendation.getSuccesRate() + adjustment;
            updatedSuccessRate = Math.min(100, Math.max(0, updatedSuccessRate));
            recommendation.setSuccesRate(updatedSuccessRate);
            recommendationRepository.save(recommendation);
        }
    }

    // Başarı oranını hesaplayan işlev
    public double calculateSuccessRate(EvaluationDTO evaluationDTO, Harvest harvest, double currentSuccessRate) {

        //* Katsayılar ayarlanabilir ileride o bölgedeki kullanıcı sayısına göre oran ayarlanabilir böylece kişilerin yaptığı etki daha stabil olabilir.

        double productQualityCoefficient = 0.5;
        double yieldCoefficient = 0.5;
        double weatherCoefficient = 1;
        double irrigationCoefficient = 1.0;

        double adjustment = 0;

        switch (evaluationDTO.getProductQuality()) {
            case "Çok İyi":
                adjustment += 5 * productQualityCoefficient;
                break;
            case "İyi":
                adjustment += 3 * productQualityCoefficient;
                break;
            case "Orta":
                adjustment += 0;
                break;
            case "Kötü":
                adjustment -= 3 * productQualityCoefficient;
                break;
            case "Çok Kötü":
                adjustment -= 5 * productQualityCoefficient;
                break;
        }

        double sowingArea = harvest.getSowing().getSowingField();
        double plantYieldStandard = harvest.getSowing().getPlant().getYieldPerSquareMeter();
        double yieldPerArea = evaluationDTO.getProductQuantity() / sowingArea;

        if (yieldPerArea >= plantYieldStandard) {
            adjustment += 3 * yieldCoefficient;
        } else {
            adjustment -= 2 * yieldCoefficient;
        }

        String weatherCondition = evaluationDTO.getWeatherCondition();

        if (weatherCondition.equalsIgnoreCase("Kötü") && yieldPerArea > plantYieldStandard) {
            adjustment += 3 * weatherCoefficient;
        } else if (weatherCondition.equalsIgnoreCase("İyi") && yieldPerArea < plantYieldStandard) {
            adjustment -= 3 * weatherCoefficient;
        }

        int irrigation = Integer.parseInt(evaluationDTO.getIrrigation());
        int fertilisation = Integer.parseInt(evaluationDTO.getFertilisation());
        int spraying = Integer.parseInt(evaluationDTO.getSpraying());

        if (irrigation == 1 && fertilisation == 1 && spraying == 1) {
            if (evaluationDTO.getProductQuality().equals("Kötü") && yieldPerArea < plantYieldStandard) {
                adjustment -= 5 * irrigationCoefficient;
            }
        } else {
            if (irrigation == 0 && fertilisation == 0 && spraying == 0) {
                if (evaluationDTO.getProductQuality().equals("Çok İyi") && yieldPerArea > plantYieldStandard) {
                    adjustment += 7 * irrigationCoefficient;
                }
            }
        }

        if (irrigation == 0 || fertilisation == 0 || spraying == 0) {
            if (evaluationDTO.getProductQuality().equals("İyi") && yieldPerArea > plantYieldStandard) {
                adjustment += 3 * irrigationCoefficient;
            }
        }

        return adjustment;
    }
}



