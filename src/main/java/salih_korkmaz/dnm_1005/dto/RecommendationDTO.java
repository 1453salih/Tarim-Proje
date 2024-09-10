package salih_korkmaz.dnm_1005.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;



@Data
public class RecommendationDTO {
    private Long id;
    private double succesRate;
    private String harvestPeriod;
    private String SowingPeriod;
    private long plantId;
    private String plantName;
    private String plantImage;
    private LocalityDTO locality;
    private double cropPerSquareMeter;
}
