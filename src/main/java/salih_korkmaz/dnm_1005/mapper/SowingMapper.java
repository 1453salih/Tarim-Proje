package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Sowing;

//Doğrudan Entity'leri kullanmak yerine Dto'ya dönüştürerek


@Component
public class SowingMapper {

    public SowingDTO toDto(Sowing sowing) {
        SowingDTO sowingDto = new SowingDTO();
        sowingDto.setId(sowing.getId());
        sowingDto.setPlantId(sowing.getPlant().getId());
        sowingDto.setPlantName(sowing.getPlant().getName());
        sowingDto.setLandId(sowing.getLand().getId());
        sowingDto.setLandName(sowing.getLand().getName());
        sowingDto.setSowingDate(sowing.getSowingDate());
        return sowingDto;
    }

    public Sowing toEntity(SowingDTO sowingDto) {
        Sowing sowing = new Sowing();
        // Entity dönüşümünü burada tanımlanabilir şuan gerek yok.
        return sowing;
    }
}
