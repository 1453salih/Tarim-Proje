package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.DistrictDTO;
import salih_korkmaz.dnm_1005.entity.District;

@Component
public class DistrictMapper {


    public  DistrictDTO toDTO (District district) {
        DistrictDTO districtDTO = new DistrictDTO();
        districtDTO.setCode(district.getCode());
        districtDTO.setName(district.getName());
        districtDTO.setSlug(district.getSlug());
        districtDTO.setType(district.getType());
        districtDTO.setLatitude(district.getLatitude());
        districtDTO.setLongitude(district.getLongitude());
        districtDTO.setCityCode(district.getCity().getCode());
        return districtDTO;
    }
}
