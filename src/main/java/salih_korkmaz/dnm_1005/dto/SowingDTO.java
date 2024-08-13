package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class SowingDTO {
    private Long id;

    private Long plantId;

    @NotNull(message = "Sowing date cannot be null")
}
