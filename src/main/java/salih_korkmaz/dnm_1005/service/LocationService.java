package salih_korkmaz.dnm_1005.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.CityDTO;
import salih_korkmaz.dnm_1005.dto.DistrictDTO;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.mapper.CityMapper;
import salih_korkmaz.dnm_1005.mapper.DistrictMapper;
import salih_korkmaz.dnm_1005.mapper.LocalityMapper;
import salih_korkmaz.dnm_1005.repository.CityRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final CityRepository cityRepository;
    private final DistrictService  districtService;
    private final DistrictMapper districtMapper;
    private final CityMapper cityMapper;
    private final LocalityMapper localityMapper;
    private final LocalityRepository localityRepository;

    public LocationService(CityRepository cityRepository, DistrictService districtService, DistrictMapper districtMapper, CityMapper cityMapper, LocalityMapper localityMapper, LocalityRepository localityRepository) {
        this.cityRepository = cityRepository;
        this.districtService = districtService;
        this.districtMapper = districtMapper;
        this.cityMapper = cityMapper;
        this.localityMapper = localityMapper;
        this.localityRepository = localityRepository;
    }

    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream().map(cityMapper::toDTO).collect(Collectors.toList());
    }

    public List<DistrictDTO> getDistrictsByCityCode(int cityCode) {
        return districtService.findByCityCode(cityCode).stream().map(districtMapper::toDTO).collect(Collectors.toList());
    }

    public List<LocalityDTO> getLocalitiesByDistrictCode(long districtCode) {
        return localityRepository.findByDistrictCode(districtCode).stream().map(localityMapper::toDTO).collect(Collectors.toList());
    }

    public Locality findById(Long localityCode) {
        return localityRepository.findById(localityCode)
                .orElseThrow(() -> new EntityNotFoundException("Lokasyon bulunamadı."));
    }


    public List<Locality> findByDistrictCode(long districtCode) {
        return localityRepository.findByDistrictCode(districtCode);
    }
}
