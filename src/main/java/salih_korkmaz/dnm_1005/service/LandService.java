package salih_korkmaz.dnm_1005.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.repository.LandRepository;

import java.util.List;

@Service
public class LandService {

    @Autowired
    private LandRepository landRepository;

    public Land saveLand(Land land) {
        return landRepository.save(land);
    }

    public List<Land>getAllLands() {
        return landRepository.findAll();
    }
}