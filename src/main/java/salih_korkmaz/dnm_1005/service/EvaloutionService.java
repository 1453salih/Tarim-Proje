package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.EvaloutionDTO;
import salih_korkmaz.dnm_1005.entity.Evaloution;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.mapper.EvaloutionMapper;
import salih_korkmaz.dnm_1005.repository.EvaloutionRepository;

@Service
public class EvaloutionService {
    private final HarvestService harvestService;
    private final EvaloutionMapper evaloutionMapper;
    private final EvaloutionRepository evaloutionRepository;

    public EvaloutionService(HarvestService harvestService, EvaloutionMapper evaloutionMapper, EvaloutionRepository evaloutionRepository) {
        this.harvestService = harvestService;
        this.evaloutionMapper = evaloutionMapper;
        this.evaloutionRepository = evaloutionRepository;
    }

    public EvaloutionDTO saveEvaloution(EvaloutionDTO evaloutionDTO){
        Harvest harvest = harvestService.findHarvestById(evaloutionDTO.getHarvestId());
        Evaloution evaloution = evaloutionMapper.toEntity(evaloutionDTO);
        evaloution.setHarvest(harvest);
        Evaloution savedEvaloution = evaloutionRepository.save(evaloution);
        return evaloutionMapper.toDTO(savedEvaloution);
    }

    public void deleteEvaluationByHarvestId(Long harvestId) {
        evaloutionRepository.deleteByHarvestId(harvestId);
    }

    public Evaloution findEvaloutionById(Long evaloutionId){
        return evaloutionRepository.findById(evaloutionId)
                .orElseThrow(() -> new RuntimeException("Evaloution not found"));
    }

    public EvaloutionDTO findEvaloutionByHarvestId(Long harvestId) {
        Evaloution evaloution = evaloutionRepository.findByHarvestId(harvestId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found for Harvest ID: " + harvestId));
        return evaloutionMapper.toDTO(evaloution);
    }

    public void deleteEvaloution(Long evaloutionId) {
        Evaloution evaloution = findEvaloutionById(evaloutionId);
        evaloutionRepository.delete(evaloution);
    }
}
