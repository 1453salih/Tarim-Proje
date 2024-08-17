package salih_korkmaz.dnm_1005.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import salih_korkmaz.dnm_1005.dto.CityDTO;
import salih_korkmaz.dnm_1005.dto.DistrictDTO;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.service.LocationService;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<CityDTO>> getAllCities() {
        return ResponseEntity.ok(locationService.getAllCities());
    }

    @GetMapping("/districts/{cityCode}")
    public ResponseEntity<List<DistrictDTO>> getDistrictsByCity(@PathVariable int cityCode) {
        return ResponseEntity.ok(locationService.getDistrictsByCityCode(cityCode));
    }

    @GetMapping("/localities/{districtCode}")
    public ResponseEntity<List<LocalityDTO>> getLocalitiesByDistrict(@PathVariable long districtCode) {
        return ResponseEntity.ok(locationService.getLocalitiesByDistrictCode(districtCode));
    }
}
