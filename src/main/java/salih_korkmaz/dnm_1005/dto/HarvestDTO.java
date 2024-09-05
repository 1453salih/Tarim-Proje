package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HarvestDTO {
    private Long id;
    private Long sowingId;
    private String landName;
    private String landType;
    private String plantName;
    private int sowingField;
    private LocalDate sowingDate;
    private LocalDate harvestDate;
}
