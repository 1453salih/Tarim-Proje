package salih_korkmaz.dnm_1005.controller;

import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.PlantDTO;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.service.PlantService;

import java.util.List;

@RestController
@RequestMapping("/plants")
@CrossOrigin(origins = "http://localhost:5173")
public class PlantController {


    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @PostMapping
    public Plant createPlant(@RequestBody PlantDTO plantDto) {
        Plant plant = new Plant();
        plant.setName(plantDto.getName());
        return plantService.savePlant(plant);
    }

    @GetMapping
    public List<PlantDTO> getAllPlants() {
        return plantService.getAllPlants();
    }

    @GetMapping("/by-category")
    public List<PlantDTO> getPlantsByCategory(@RequestParam Long categoryId) {
        return plantService.getPlantsByCategory(categoryId);
    }

    @GetMapping("/detail/{id}")
    public PlantDTO getPlantById(@PathVariable Long id) {
        return plantService.getPlantById(id);
    }
}
