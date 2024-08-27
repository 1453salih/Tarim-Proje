package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.dto.LocationDTO;
import salih_korkmaz.dnm_1005.entity.Land;

@Component
public class LandMapper {

    public LandDTO toDTO(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setUserId(land.getUser().getId());
        landDto.setLocalityId(land.getLocality().getCode());
        landDto.setImageUrl(land.getImage());

        // LocationDTO'yu mapper'a dahil ediyoruz aşağıda tanımlanıyor.
        landDto.setLocation(toLocationDTO(land));

        return landDto;
    }

    private LocationDTO toLocationDTO(Land land) {
        return new LocationDTO(
                land.getLocality().getDistrict().getCity().getName(),
                land.getLocality().getDistrict().getName(),
                land.getLocality().getName(),
                land.getLocality().getDistrict().getCity().getCode(),
                land.getLocality().getDistrict().getCode(),
                land.getLocality().getCode()
        );
    }
}
