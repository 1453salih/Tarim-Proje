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
//! Burada Kayıt işlemi olduğundan bu repository'i kaldırmadım zaten kayıt  işleminde repository kullanılıyor o yüzden diğerlerinide service üzerinden yapmaya çalışmadım.
@Service
public class EvaluationService {
    private final HarvestService harvestService;
    private final EvaluationMapper evaluationMapper;
    private final EvaluationRepository evaluationRepository;
    private final EvaluationDetailsMapper evaluationDetailsMapper;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationService recommendationService;

    public EvaluationService(HarvestService harvestService, EvaluationMapper evaluationMapper, EvaluationRepository evaluationRepository, EvaluationDetailsMapper evaluationDetailsMapper, RecommendationRepository recommendationRepository, RecommendationService recommendationService) {
        this.harvestService = harvestService;
        this.evaluationMapper = evaluationMapper;
        this.evaluationRepository = evaluationRepository;
        this.evaluationDetailsMapper = evaluationDetailsMapper;
        this.recommendationRepository = recommendationRepository;
        this.recommendationService = recommendationService;
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
            recommendationService.updateSuccessRate(evaluationDTO, harvest, recommendation.getSuccesRate());
        } else {
            Recommendation newRecommendation = new Recommendation();
            newRecommendation.setPlant(harvest.getSowing().getPlant());
            newRecommendation.setLocality(harvest.getSowing().getLand().getLocality());
            newRecommendation.setSuccesRate(70); // Varsayılan başarı oranı
            recommendationRepository.save(newRecommendation);
            recommendationService.updateSuccessRate(evaluationDTO, harvest, 70); // Varsayılan başarı oranı kullanılıyor
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
                .orElseThrow(() -> new RuntimeException("Değerlendirme bulunamadı."));
    }

    public EvaluationDTO findEvaluationByHarvestId(Long harvestId) {
        Evaluation evaluation = evaluationRepository.findByHarvestId(harvestId)
                .orElseThrow(() -> new RuntimeException("Hasat Id'li değerlendirme bulunamadı: " + harvestId));
        return evaluationMapper.toDTO(evaluation);
    }

    public void deleteEvaluation(Long evaluationId) {
        Evaluation evaluation = findEvaluationById(evaluationId);
        evaluationRepository.delete(evaluation);
    }

    public EvaluationDetailsDTO getEvaluationDetails(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Değerlendirme bulunamadı."));
        return evaluationDetailsMapper.toDto(evaluation);
    }

    public EvaluationDTO getEvaluation(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Değerlendirme bulunamadı."));
        return evaluationMapper.toDTO(evaluation);
    }

    public List<EvaluationDetailsDTO> getEvaluationsByUser(Long userId) {
        List<Evaluation> evaluations = evaluationRepository.findByHarvestSowingLandUserId(userId);
        return evaluations.stream()
                .map(evaluationDetailsMapper::toDto)
                .collect(Collectors.toList());
    }
}
