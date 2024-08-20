package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Sowing;

//Doğrudan Entity'leri kullanmak yerine Dto'ya dönüştürerek


@Component
public class SowingMapper {

    public SowingDTO toDto(Sowing sowing) {
        SowingDTO sowingDto = new SowingDTO();
        sowingDto.setId(sowing.getId());
        sowingDto.setSowingField(sowing.getSowingField());
        sowingDto.setPlantId(sowing.getPlant().getId());
        sowingDto.setPlantName(sowing.getPlant().getName());
        sowingDto.setLandId(sowing.getLand().getId());
        sowingDto.setLandName(sowing.getLand().getName());
        sowingDto.setSowingDate(sowing.getSowingDate());
        return sowingDto;
    }

    public Sowing toEntity(SowingDTO sowingDto) {
        Sowing sowing = new Sowing();

        // ID set edilmiyor çünkü yeni bir varlık yaratılıyor.
        if (sowingDto.getId() != null) {
            sowing.setId(sowingDto.getId());
        }

        // Plant ve Land nesnelerini Entity olarak set etmeniz gerekiyor.
        // Bunun için Plant ve Land Service'lerinizden ilgili nesneleri bulmanız gerekebilir.
        Plant plant = new Plant();
        plant.setId(sowingDto.getPlantId());
        sowing.setPlant(plant);

        Land land = new Land();
        land.setId(sowingDto.getLandId());
        sowing.setLand(land);

        sowing.setSowingField(sowingDto.getSowingField());

        // SowingDate
        sowing.setSowingDate(sowingDto.getSowingDate());

        return sowing;
    }
}
