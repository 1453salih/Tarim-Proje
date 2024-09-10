package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.mapper.HarvestMapper;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;

import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public HarvestDTO saveHarvest(HarvestDTO harvestDto) {
        Sowing sowing = sowingService.findSowingById(harvestDto.getSowingId());

        Harvest harvest = harvestMapper.toEntity(harvestDto);
        harvest.setSowing(sowing);
        Harvest savedHarvest = harvestRepository.save(harvest);

        // Hasat yapıldığında ekim yapılan alanı tekrar ekilebilir hale getirir.
        Long landId = sowing.getLand().getId();
        double sowingField = sowing.getSowingField();
        landService.addToClayableLand(landId, sowingField);  // Ekim yapılan alanı tekrar ekilebilir hale getirir.

        return harvestMapper.toDTO(savedHarvest);
    }



    public Harvest findHarvestById(Long harvestId){
        System.out.println("Finding Harvest with id: " + harvestId);
        return harvestRepository.findById(harvestId)
                .orElseThrow(()-> new RuntimeException("Harvest not found"));
    }


    // Yeni metot: Belirli bir ekim için hasat edilip edilmediğini kontrol eder.
    public boolean existsBySowingId(Long sowingId) {
        return harvestRepository.existsBySowingId(sowingId);
    }

    @Transactional
    public void deleteHarvest(Long harvestId) {
        Harvest harvest = findHarvestById(harvestId);
        Sowing sowing = harvest.getSowing();

        // Hasat silindiğinde ekim alanı tekrar kullanılmadığı için alanı azaltır.
        Long landId = sowing.getLand().getId();
        double sowingField = sowing.getSowingField();
        landService.subtractFromClayableLand(landId, sowingField);  // Alanı tekrar kullanılmaz hale getirir.

        harvestRepository.delete(harvest);
    }




    public List<Harvest> getHarvestsByUserId(Long userId) {
        return harvestRepository.findBySowingLandUserId(userId);
    }

    public List<HarvestDTO> getAllHarvestsByUserId(Long userId) {
        List<Harvest> harvests = harvestRepository.findBySowingLandUserId(userId);
        return harvests.stream()
                .map(harvestMapper::toDTO)
                .collect(Collectors.toList());
    }

}
