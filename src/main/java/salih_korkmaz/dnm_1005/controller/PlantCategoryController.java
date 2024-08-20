package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.dto.PlantDTO;
import salih_korkmaz.dnm_1005.service.PlantCategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class PlantCategoryController {

    private final PlantCategoryService plantCategoryService;

    @Autowired
    public PlantCategoryController(PlantCategoryService plantCategoryService) {
        this.plantCategoryService = plantCategoryService;
    }

    @GetMapping
    public List<PlantCategoryDTO> getAllCategories() {
        return plantCategoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public PlantCategoryDTO getPlantCategory(@PathVariable Long id) {
        return plantCategoryService.getPlantCategoryById(id);
    }

    @GetMapping("/by-plant/{plantId}")
    public PlantCategoryDTO getCategoryByPlantId(@PathVariable Long plantId) {
        return plantCategoryService.getPlantCategoryByPlantId(plantId);
    }
}
