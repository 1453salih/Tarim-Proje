package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.RecommendationDTO;
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

}


