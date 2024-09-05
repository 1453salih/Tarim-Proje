package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Sowing;

@Component
public class HarvestMapper {

    public HarvestDTO toDTO(Harvest harvest){
        HarvestDTO harvestDTO = new HarvestDTO();

        // Harvest alanları
        harvestDTO.setId(harvest.getId());
        harvestDTO.setHarvestDate(harvest.getHarvestDate());

        // Sowing alanları
        Sowing sowing = harvest.getSowing();
        harvestDTO.setSowingId(sowing.getId());
        harvestDTO.setLandName(sowing.getLand().getName());  // Arazi adını set etme
        harvestDTO.setPlantName(sowing.getPlant().getName());  // Bitki adını set etme
        harvestDTO.setSowingField(sowing.getSowingField());  // Ekim alanını set etme
        harvestDTO.setLandType(sowing.getLand().getLandType());  // Ekim türünü set etme
        harvestDTO.setSowingDate(sowing.getSowingDate());  // Ekim tarihini set etme

        return harvestDTO;
    }

    public Harvest toEntity(HarvestDTO harvestDto){
        Harvest harvest = new Harvest();

        // ID kontrolü
        if (harvestDto.getId() != null) {
            harvest.setId(harvestDto.getId());
        }

        // Sowing nesnesi Entity olarak set edilir.
        Sowing sowing = new Sowing();
        sowing.setId(harvestDto.getSowingId());
        // Diğer Sowing alanlarını Harvest entity'sine set etmeye gerek yoktur çünkü bu alanlar doğrudan Sowing entity'sinden alınır.
        harvest.setSowing(sowing);

        // Hasat tarihi set edilir.
        harvest.setHarvestDate(harvestDto.getHarvestDate());

        return harvest;
    }
}
