package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.dto.PlantDTO;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.service.PlantService;

import java.util.List;

@RestController
@RequestMapping("/plants")
@CrossOrigin(origins = "http://localhost:5173")
public class PlantController {

    @Autowired
    private PlantService plantService;

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

    @GetMapping("/detail/{id}")
    public PlantDTO getPlantById(@PathVariable Long id) {
        return plantService.getPlantById(id);
    }
}
