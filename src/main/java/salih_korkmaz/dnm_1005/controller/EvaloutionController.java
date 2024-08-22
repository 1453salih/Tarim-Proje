package salih_korkmaz.dnm_1005.controller;


import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.EvaloutionDTO;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;
import salih_korkmaz.dnm_1005.service.EvaloutionService;

@RequestMapping("/evaloutions")
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class EvaloutionController {
    private final EvaloutionService evaloutionService;

    public EvaloutionController(EvaloutionService evaloutionService, HarvestRepository harvestRepository) {
        this.evaloutionService = evaloutionService;
    }
    @PostMapping
    public EvaloutionDTO makeEvaloution(@RequestBody EvaloutionDTO evaloutionDTO){
        return evaloutionService.saveEvaloution(evaloutionDTO);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteEvaloution(@PathVariable Long id) {
        evaloutionService.deleteEvaloution(id);
    }
    @GetMapping("/harvest/{harvestId}")
    public EvaloutionDTO getEvaloutionByHarvestId(@PathVariable Long harvestId) {
        return evaloutionService.findEvaloutionByHarvestId(harvestId);
    }
}
