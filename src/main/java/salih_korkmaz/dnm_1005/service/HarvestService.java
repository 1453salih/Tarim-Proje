package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.mapper.HarvestMapper;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;

import java.util.List;

@Service
public class HarvestService {

    private final SowingService sowingService;
    private final HarvestMapper harvestMapper;
    private final HarvestRepository harvestRepository;

    public HarvestService(SowingService sowingService, HarvestMapper harvestMapper,HarvestRepository harvestRepository) {
        this.sowingService = sowingService;
        this.harvestMapper = harvestMapper;
        this.harvestRepository = harvestRepository;
    }

    public HarvestDTO saveHarvest(HarvestDTO harvestDto){
        //Sowing nesnesi döndürülür.
        Sowing sowing = sowingService.findSowingById(harvestDto.getSowingId());

        Harvest harvest = harvestMapper.toEntity(harvestDto);
        harvest.setSowing(sowing);

        Harvest savedHarvest = harvestRepository.save(harvest);
        return harvestMapper.toDTO(savedHarvest);
    }

    public Harvest findHarvestById(Long harvestId){
        return harvestRepository.findById(harvestId)
                .orElseThrow(()-> new RuntimeException("Harvest not found"));
    }

    // Yeni metot: Belirli bir ekim için hasat edilip edilmediğini kontrol eder
    public boolean existsBySowingId(Long sowingId) {
        return harvestRepository.existsBySowingId(sowingId);
    }

    public void deleteHarvest(Long harvestId) {
        Harvest harvest = findHarvestById(harvestId);
        harvestRepository.delete(harvest);
    }

    public List<Harvest> getHarvestsByUserId(Long userId) {
        return harvestRepository.findBySowingLandUserId(userId);
    }

}
