package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.dto.EvaluationDetailsDTO;
import salih_korkmaz.dnm_1005.entity.*;
import salih_korkmaz.dnm_1005.mapper.EvaluationDetailsMapper;
import salih_korkmaz.dnm_1005.mapper.EvaluationMapper;
import salih_korkmaz.dnm_1005.repository.EvaluationRepository;
import salih_korkmaz.dnm_1005.repository.RecommendationRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {
    private final HarvestService harvestService;
    private final EvaluationMapper evaluationMapper;
    private final EvaluationRepository evaluationRepository;
    private final EvaluationDetailsMapper evaluationDetailsMapper;
    private final RecommendationRepository recommendationRepository;

    public EvaluationService(HarvestService harvestService, EvaluationMapper evaluationMapper, EvaluationRepository evaluationRepository, EvaluationDetailsMapper evaluationDetailsMapper, RecommendationRepository recommendationRepository) {
        this.harvestService = harvestService;
        this.evaluationMapper = evaluationMapper;
        this.evaluationRepository = evaluationRepository;
        this.evaluationDetailsMapper = evaluationDetailsMapper;
        this.recommendationRepository = recommendationRepository;
    }

    public EvaluationDTO saveEvaluation(EvaluationDTO evaluationDTO) {
        Harvest harvest = harvestService.findHarvestById(evaluationDTO.getHarvestId());
        Evaluation evaluation = evaluationMapper.toEntity(evaluationDTO);
        evaluation.setHarvest(harvest);
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);

        Optional<Recommendation> optionalRecommendation = recommendationRepository.findByPlantAndLocality(
                harvest.getSowing().getPlant(),
                harvest.getSowing().getLand().getLocality()
        );

        if (optionalRecommendation.isPresent()) {
            Recommendation recommendation = optionalRecommendation.get();
            updateSuccessRate(evaluationDTO, recommendation.getSuccesRate());
        } else {
            Recommendation newRecommendation = new Recommendation();
            newRecommendation.setPlant(harvest.getSowing().getPlant());
            newRecommendation.setLocality(harvest.getSowing().getLand().getLocality());
            newRecommendation.setSuccesRate(70);
            recommendationRepository.save(newRecommendation);
            updateSuccessRate(evaluationDTO, 70);
        }

        return evaluationMapper.toDTO(savedEvaluation);
    }

    public Evaluation updateEvaluation(Long id, @Valid EvaluationDTO evaluationDto) {
        Evaluation existingEvaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Değerlendirme bulunamadı."));
        Evaluation updatedEvaluation = evaluationMapper.toEntity(evaluationDto);
        updatedEvaluation.setId(existingEvaluation.getId());

        if (evaluationDto.getHarvestId() != null) {
            Harvest harvest = Optional.ofNullable(harvestService.findHarvestById(evaluationDto.getHarvestId()))
                    .orElseThrow(() -> new RuntimeException("Ekim bulunamadı"));
            updatedEvaluation.setHarvest(harvest);
        }

        return evaluationRepository.save(updatedEvaluation);
    }

    public Evaluation findEvaluationById(Long evaluationId){
        return evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
    }

    public EvaluationDTO findEvaluationByHarvestId(Long harvestId) {
        Evaluation evaluation = evaluationRepository.findByHarvestId(harvestId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found for Harvest ID: " + harvestId));
        return evaluationMapper.toDTO(evaluation);
    }

    public void deleteEvaluation(Long evaluationId) {
        Evaluation evaluation = findEvaluationById(evaluationId);
        evaluationRepository.delete(evaluation);
    }

    public EvaluationDetailsDTO getEvaluationDetails(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        return evaluationDetailsMapper.toDto(evaluation);
    }

    public EvaluationDTO getEvaluation(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        return evaluationMapper.toDTO(evaluation);
    }

    public List<EvaluationDetailsDTO> getEvaluationsByUser(Long userId) {
        List<Evaluation> evaluations = evaluationRepository.findByHarvestSowingLandUserId(userId);
        return evaluations.stream()
                .map(evaluationDetailsMapper::toDto)
                .collect(Collectors.toList());
    }

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

    public void updateSuccessRate(EvaluationDTO evaluationDTO, double currentSuccessRate) {
        Harvest harvest = harvestService.findHarvestById(evaluationDTO.getHarvestId());
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
}//PUSH İÇİN YAZILDI
