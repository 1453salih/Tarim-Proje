package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.entity.District;
import salih_korkmaz.dnm_1005.repository.DistrictRepository;

import java.util.List;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    public List<District> findByCityCode(int cityCode) {
        return districtRepository.findByCityCode(cityCode);
    }

}
