package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.entity.Evaluation;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.mapper.EvaluationMapper;
import salih_korkmaz.dnm_1005.repository.EvaluationRepository;

@Service
public class EvaluationService {
    private final HarvestService harvestService;
    private final EvaluationMapper evaluationMapper;
    private final EvaluationRepository evaluationRepository;

    public EvaluationService(HarvestService harvestService, EvaluationMapper evaluationMapper, EvaluationRepository evaluationRepository) {
        this.harvestService = harvestService;
        this.evaluationMapper = evaluationMapper;
        this.evaluationRepository = evaluationRepository;
    }

    public EvaluationDTO saveEvaluation(EvaluationDTO evaluationDTO){
        Harvest harvest = harvestService.findHarvestById(evaluationDTO.getHarvestId());
        Evaluation evaluation = evaluationMapper.toEntity(evaluationDTO);
        evaluation.setHarvest(harvest);
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);
        return evaluationMapper.toDTO(savedEvaluation);
    }

    public void deleteEvaluationByHarvestId(Long harvestId) {
        evaluationRepository.deleteByHarvestId(harvestId);
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
}
