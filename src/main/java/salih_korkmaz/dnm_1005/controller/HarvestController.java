package salih_korkmaz.dnm_1005.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;
import salih_korkmaz.dnm_1005.service.HarvestService;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/harvests")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HarvestController {

    private final HarvestService harvestService;

    public HarvestController(HarvestService harvestService, HarvestRepository harvestRepository) {
        this.harvestService = harvestService;
    }

    @PostMapping
    public HarvestDTO makeHarvest(@RequestBody HarvestDTO harvestDto) {
        return harvestService.saveHarvest(harvestDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteHarvest(@PathVariable Long id) {
        System.out.println("Deleting Harvest with id: " + id);
        harvestService.deleteHarvest(id);
    }

    @GetMapping("/user/{userId}")
    public Page<HarvestDTO> getFilteredHarvestsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String plantName,
            @RequestParam(required = false) String landName,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "sowing.sowingDate") String sortBy, // doğru alan adı
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        PageRequest pageable = PageRequest.of(page, size, sort);
        return harvestService.getFilteredHarvests(userId, plantName, landName, minArea, maxArea, startDate, endDate, pageable);
    }
}
