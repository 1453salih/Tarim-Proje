package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.mapper.HarvestMapper;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;

import java.time.LocalDate;

@Service
public class HarvestService {

    private final SowingService sowingService;
    private final HarvestMapper harvestMapper;
    private final HarvestRepository harvestRepository;
    private final LandService landService;

    public HarvestService(SowingService sowingService, HarvestMapper harvestMapper, HarvestRepository harvestRepository, LandService landService) {
        this.sowingService = sowingService;
        this.harvestMapper = harvestMapper;
        this.harvestRepository = harvestRepository;
        this.landService = landService;
    }

    public Harvest findHarvestById(Long harvestId){
        return harvestRepository.findById(harvestId)
                .orElseThrow(() -> new RuntimeException("Hasat bulunamadı."));
    }

    // Belirli bir ekim için hasat edilip edilmediğini kontrol eder.
    public boolean existsBySowingId(Long sowingId) {
        return harvestRepository.existsBySowingId(sowingId);
    }

    @Transactional
    public HarvestDTO saveHarvest(HarvestDTO harvestDto) {
        Sowing sowing = sowingService.findSowingById(harvestDto.getSowingId());

        Harvest harvest = harvestMapper.toEntity(harvestDto);
        harvest.setSowing(sowing);
        Harvest savedHarvest = harvestRepository.save(harvest);

        // Hasat yapıldığında ekim yapılan alanı tekrar ekilebilir hale getirir.
        Long landId = sowing.getLand().getId();
        double sowingField = sowing.getSowingField();
        landService.addToClayableLand(landId, sowingField);

        return harvestMapper.toDTO(savedHarvest);
    }

    @Transactional
    public void deleteHarvest(Long harvestId) {
        Harvest harvest = findHarvestById(harvestId);
        Sowing sowing = harvest.getSowing();

        // Hasat silindiğinde ekim alanı tekrar kullanılmadığı için alanı azaltır.
        Long landId = sowing.getLand().getId();
        double sowingField = sowing.getSowingField();
        landService.subtractFromClayableLand(landId, sowingField);

        harvestRepository.delete(harvest);
    }

    public Page<HarvestDTO> getFilteredHarvests(Long userId, String plantName, String landName, Double minArea, Double maxArea, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Harvest> spec = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("sowing").get("land").get("user").get("id"), userId));

        if (plantName != null && !plantName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("sowing").get("plant").get("name")), "%" + plantName.toLowerCase() + "%"));
        }
        if (landName != null && !landName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("sowing").get("land").get("name")), "%" + landName.toLowerCase() + "%"));
        }
        if (minArea != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("sowing").get("sowingField"), minArea));
        }
        if (maxArea != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("sowing").get("sowingField"), maxArea));
        }
        if (startDate != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("sowing").get("sowingDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("sowing").get("sowingDate"), endDate));
        }

        return harvestRepository.findAll(spec, pageable).map(harvestMapper::toDTO);
    }

    public long getHarvestCountBySowingLandUser(Long userId){
        return harvestRepository.countBySowingLandUserId(userId);
    }

}
