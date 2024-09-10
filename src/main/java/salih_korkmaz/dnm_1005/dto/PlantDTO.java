package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class PlantDTO {
    private Long id;

    private String harvestPeriod;

    private String SowingPeriod;

    private String image;

    @NotNull(message = "Name cannot be null")
    private String name;

    @NotNull(message = "Category name cannot be null")
    private String categoryName;

    private double yieldPerSquareMeter;
}
