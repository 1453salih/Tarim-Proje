package salih_korkmaz.dnm_1005.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import salih_korkmaz.dnm_1005.dto.PlantCategoryDTO;
import salih_korkmaz.dnm_1005.service.PlantCategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class PlantCategoryController {

    @Autowired
    private PlantCategoryService plantCategoryService;

    @GetMapping
    public List<PlantCategoryDTO> getAllCategories() {
        return plantCategoryService.getAllCategories();
    }
}
