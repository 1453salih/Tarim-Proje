package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LocationDTO;
import salih_korkmaz.dnm_1005.entity.Land;

@Component
public class LocationMapper {
    public LocationDTO toLocationDTO(Land land) {
        if (land.getLocality() != null && land.getLocality().getDistrict() != null && land.getLocality().getDistrict().getCity() != null) {
            return new LocationDTO(
                land.getLocality().getDistrict().getCity().getName(),
                land.getLocality().getDistrict().getName(),
                land.getLocality().getName(),
                land.getLocality().getDistrict().getCity().getCode(),
                land.getLocality().getDistrict().getCode(),
                land.getLocality().getCode()
            );
        }
        return null; // Eğer locality bilgileri null ise null döner
    }
}
