package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LocalityDTO;
import salih_korkmaz.dnm_1005.entity.Locality;

@Component
public class LocalityMapper {

    public LocalityDTO toDTO(Locality locality) {
        LocalityDTO localityDto = new LocalityDTO();
        localityDto.setCode(locality.getCode());
        localityDto.setName(locality.getName());
        localityDto.setSlug(locality.getSlug());
        localityDto.setType(locality.getType());
        localityDto.setDistrictCode(locality.getDistrict().getCode());
        return localityDto;
    }

}
