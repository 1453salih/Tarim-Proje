package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.EvaluationDTO;
import salih_korkmaz.dnm_1005.dto.RecommendationDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.Recommendation;
import salih_korkmaz.dnm_1005.mapper.RecommendationMapper;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;
import salih_korkmaz.dnm_1005.repository.RecommendationRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final RecommendationMapper recommendationMapper;
    private final LocalityRepository localityRepository;

    public RecommendationService(RecommendationRepository recommendationRepository, RecommendationMapper recommendationMapper, LocalityRepository localityRepository) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationMapper = recommendationMapper;
        this.localityRepository = localityRepository;
    }

    public List<RecommendationDTO> getRecommendationsByLocalityCode(Long localityCode) {
        Locality locality = localityRepository.findById(localityCode)
                .orElseThrow(() -> new RuntimeException("Kod için yer bulunamadı: " + localityCode));
        return recommendationRepository.findByLocality(locality).stream()
                .map(recommendationMapper::toDTO)
                .collect(Collectors.toList());
    }
}


