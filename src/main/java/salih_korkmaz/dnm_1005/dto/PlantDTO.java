package salih_korkmaz.dnm_1005.dto;


import lombok.Data;

import jakarta.validation.constraints.NotNull;


@Data
public class PlantDTO {
    private Long id;

    @NotNull(message = "Plant Id cannot be null")
    private Long plantId;

    @NotNull(message = "Sowing date cannot be null")
    private int sowingDate;

    @NotNull()
    private Long landId;
}
