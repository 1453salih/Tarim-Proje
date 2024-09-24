package salih_korkmaz.dnm_1005.controller;


import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.dto.EvaluationDataDTO;
import salih_korkmaz.dnm_1005.dto.EvaluationDetailsDTO;
import salih_korkmaz.dnm_1005.entity.Evaluation;
import salih_korkmaz.dnm_1005.entity.User;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;
import salih_korkmaz.dnm_1005.service.EvaluationService;
import salih_korkmaz.dnm_1005.service.UserService;

import java.util.List;

@RequestMapping("/evaluations")
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EvaluationController {
    private final EvaluationService evaluationService;
    private final UserService userService;

    public EvaluationController(EvaluationService evaluationService, HarvestRepository harvestRepository, UserService userService) {
        this.evaluationService = evaluationService;
        this.userService = userService;
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

    @GetMapping("/{id}")
    public EvaluationDetailsDTO getEvaluationDetails(@PathVariable Long id) {
        return evaluationService.getEvaluationDetails(id);
    }

    @GetMapping("/api/{id}")
    public EvaluationDTO getEvaluation(@PathVariable Long id) {
        return evaluationService.getEvaluation(id);
    }

    @GetMapping
    public List<EvaluationDetailsDTO> getEvaluationsByUser() {
        User user = userService.getAuthenticatedUser();
        return evaluationService.getEvaluationsByUser(user.getId());
    }


    @PutMapping("/{id}")
    public Evaluation updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDTO evaluationDto) {
        return evaluationService.updateEvaluation(id, evaluationDto);
    }

    @GetMapping("/products/kg")
    public List<EvaluationDataDTO> getUserHarvestData() {
        User user = userService.getAuthenticatedUser();
        return evaluationService.getUserHarvestData(user.getId());
    }

    @GetMapping("/products/top")
    public List<EvaluationDataDTO> getTopUserHarvestData() {
        User user = userService.getAuthenticatedUser();
        return evaluationService.getTopUserHarvests(user.getId());
    }

}
