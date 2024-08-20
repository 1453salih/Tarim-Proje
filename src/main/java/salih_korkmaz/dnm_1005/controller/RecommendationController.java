package salih_korkmaz.dnm_1005.controller;

import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.RecommendationDTO;
import salih_korkmaz.dnm_1005.service.RecommendationService;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<RecommendationDTO> getRecommendationsByLocalityCode(@RequestParam Long localityCode) {
        return recommendationService.getRecommendationsByLocalityCode(localityCode);
    }
}
