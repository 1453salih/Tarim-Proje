package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.CityDTO;
import salih_korkmaz.dnm_1005.entity.City;

@Component
public class CityMapper {
    public CityDTO toDTO(City city) {
        CityDTO cityDTO = new CityDTO();
        cityDTO.setCode(city.getCode());
        cityDTO.setName(city.getName());
        cityDTO.setSlug(city.getSlug());
        cityDTO.setType(city.getType());
        cityDTO.setLatitude(city.getLatitude());
        cityDTO.setLongitude(city.getLongitude());
        return cityDTO;
    }
}
