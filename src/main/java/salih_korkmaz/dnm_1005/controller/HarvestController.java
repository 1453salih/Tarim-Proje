package salih_korkmaz.dnm_1005.controller;


import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.repository.HarvestRepository;
import salih_korkmaz.dnm_1005.service.HarvestService;

@RequestMapping("/harvests")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HarvestController {

    private final HarvestService harvestService;


    public HarvestController(HarvestService harvestService, HarvestRepository harvestRepository) {
        this.harvestService = harvestService;
    }

    @PostMapping
    public HarvestDTO makeHarvest(@RequestBody HarvestDTO harvestDto){
        return harvestService.saveHarvest(harvestDto);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteHarvest(@PathVariable Long id) {
        harvestService.deleteHarvest(id);
    }
}
