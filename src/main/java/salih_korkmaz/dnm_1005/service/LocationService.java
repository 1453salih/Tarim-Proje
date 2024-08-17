package salih_korkmaz.dnm_1005.service;

import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.CityDTO;
import salih_korkmaz.dnm_1005.dto.DistrictDTO;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.entity.City;
import salih_korkmaz.dnm_1005.entity.District;
import salih_korkmaz.dnm_1005.entity.Locality;
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

    public LocationService(CityRepository cityRepository, DistrictRepository districtRepository, LocalityRepository localityRepository) {
        this.cityRepository = cityRepository;
        this.districtRepository = districtRepository;
        this.localityRepository = localityRepository;
    }

    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream().map(this::convertToCityDTO).collect(Collectors.toList());
    }

    public List<DistrictDTO> getDistrictsByCityCode(int cityCode) {
        return districtRepository.findByCityCode(cityCode).stream().map(this::convertToDistrictDTO).collect(Collectors.toList());
    }

    public List<LocalityDTO> getLocalitiesByDistrictCode(long districtCode) {
        return localityRepository.findByDistrictCode(districtCode).stream().map(this::convertToLocalityDTO).collect(Collectors.toList());
    }

    private CityDTO convertToCityDTO(City city) {
        CityDTO dto = new CityDTO();
        dto.setCode(city.getCode());
        dto.setName(city.getName());
        dto.setSlug(city.getSlug());
        dto.setType(city.getType());
        dto.setLatitude(city.getLatitude());
        dto.setLongitude(city.getLongitude());
        return dto;
    }

    private DistrictDTO convertToDistrictDTO(District district) {
        DistrictDTO dto = new DistrictDTO();
        dto.setCode(district.getCode());
        dto.setName(district.getName());
        dto.setSlug(district.getSlug());
        dto.setType(district.getType());
        dto.setLatitude(district.getLatitude());
        dto.setLongitude(district.getLongitude());
        dto.setCityCode(district.getCity().getCode());
        return dto;
    }

    private LocalityDTO convertToLocalityDTO(Locality locality) {
        LocalityDTO dto = new LocalityDTO();
        dto.setCode(locality.getCode());
        dto.setName(locality.getName());
        dto.setSlug(locality.getSlug());
        dto.setType(locality.getType());
        dto.setDistrictCode(locality.getDistrict().getCode());
        return dto;
    }
}
