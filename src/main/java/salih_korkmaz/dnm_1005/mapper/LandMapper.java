package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LandDTO;
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
        return landDto;
    }
}
