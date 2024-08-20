package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class SowingDTO {
    private Long id;

    private int sowingField;

    @NotNull(message = "Plant ID cannot be null")
    private Long plantId;

    private String plantName;

    @NotNull(message = "Land ID cannot be null")
    private Long landId;

    private String landName;

    @NotNull(message = "Sowing date cannot be null")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate sowingDate;
}