package salih_korkmaz.dnm_1005.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.service.LandService;

import java.util.List;

@RestController
@RequestMapping("/lands")
@CrossOrigin(origins = "http://localhost:5173")
public class LandController {

    @Autowired
    private LandService landService;

    @PostMapping
    public Land createLand(@RequestBody Land land) {
        return landService.saveLand(land);
    }

    @GetMapping
    public List<Land> getAllLands() {
        return landService.getAllLands();
    }

}