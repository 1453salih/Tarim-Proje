package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class SowingDTO {
    private Long id;

    private int sowingField;

    private String landType;

    @NotNull(message = "Plant ID null olamaz")
    private Long plantId;

    private String plantName;

    private int clayableLand;

    @NotNull(message = "Land ID null olamaz")
    private Long landId;

    private String landName;

    @NotNull(message = "EKim tarihi null olamaz")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate sowingDate;
}