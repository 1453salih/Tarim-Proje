package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

import java.util.Date;


@Data
public class SowingDTO {
    private Long id;

    @NotNull(message = "Plant Id cannot be null")
    private Long plantId;

    @NotNull(message = "Sowing date cannot be null")
    private Date sowingDate;

    @NotNull()
    private Long landId;
}
