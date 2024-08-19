package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.CityDTO;
import salih_korkmaz.dnm_1005.dto.DistrictDTO;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.mapper.CityMapper;
import salih_korkmaz.dnm_1005.mapper.DistrictMapper;
import salih_korkmaz.dnm_1005.mapper.LocalityMapper;
import salih_korkmaz.dnm_1005.repository.CityRepository;
import salih_korkmaz.dnm_1005.repository.DistrictRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final CityRepository cityRepository;
    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;
    private final DistrictMapper districtMapper;
    private final CityMapper cityMapper;
    private final LocalityMapper localityMapper;

    public LocationService(CityRepository cityRepository, DistrictRepository districtRepository, LocalityRepository localityRepository, DistrictMapper districtMapper, CityMapper cityMapper, LocalityMapper localityMapper) {
        this.cityRepository = cityRepository;
        this.districtRepository = districtRepository;
        this.localityRepository = localityRepository;
        this.districtMapper = districtMapper;
        this.cityMapper = cityMapper;
        this.localityMapper = localityMapper;
    }

    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream().map(cityMapper::toDTO).collect(Collectors.toList());
    }

    public List<DistrictDTO> getDistrictsByCityCode(int cityCode) {
        return districtRepository.findByCityCode(cityCode).stream().map(districtMapper::toDTO).collect(Collectors.toList());
    }

    public List<LocalityDTO> getLocalitiesByDistrictCode(long districtCode) {
        return localityRepository.findByDistrictCode(districtCode).stream().map(localityMapper::toDTO).collect(Collectors.toList());
    }
}
