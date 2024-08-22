package salih_korkmaz.dnm_1005.mapper;

import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.HarvestDTO;
import salih_korkmaz.dnm_1005.entity.Harvest;
import salih_korkmaz.dnm_1005.entity.Sowing;

@Component
public class HarvestMapper {
    public HarvestDTO toDTO(Harvest harvest){
        HarvestDTO harvestDTO = new HarvestDTO();
        harvestDTO.setId(harvestDTO.getId());
        harvestDTO.setSowingId(harvest.getSowing().getId());
        harvestDTO.setHarvestDate(harvest.getHarvestDate());
        return harvestDTO;
    }
    public Harvest toEntity(HarvestDTO harvestDto){
        Harvest harvest = new Harvest();

        if (harvestDto.getId() != null) {
            harvest.setId(harvestDto.getId());
        }

        //Sowing nesnesi Entity olarak set edilir.
        //? Kayıt işleminde kullanılır  toEntity.
        Sowing sowing = new Sowing();
        sowing.setId(harvestDto.getSowingId());
        harvest.setSowing(sowing);

        harvest.setHarvestDate(harvestDto.getHarvestDate());

        return harvest;
    }
}
