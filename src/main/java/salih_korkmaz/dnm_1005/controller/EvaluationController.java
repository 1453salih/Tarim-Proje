package salih_korkmaz.dnm_1005.controller;


import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;
import salih_korkmaz.dnm_1005.service.EvaluationService;

@RequestMapping("/evaluations")
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EvaluationController {
    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService, HarvestRepository harvestRepository) {
        this.evaluationService = evaluationService;
    }
    @PostMapping
    public EvaluationDTO makeEvaluation(@RequestBody EvaluationDTO evaluationDTO){
        return evaluationService.saveEvaluation(evaluationDTO);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
    }


    @GetMapping("/harvest/{harvestId}")
    public EvaluationDTO getEvaluationByHarvestId(@PathVariable Long harvestId) {
        return evaluationService.findEvaluationByHarvestId(harvestId);
    }
}
