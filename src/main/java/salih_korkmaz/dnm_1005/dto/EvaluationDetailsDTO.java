package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EvaluationDetailsDTO {
    private Long evaluationId;
    private String landName;
    private String landImageUrl;
    private String plantImageUrl;
    private String plantName;
    private LocalDate sowingDate;
    private LocalDate harvestDate;
    private LocalDate evaluationDate;
    private String harvestCondition;
    private String productQuality;
    private double productQuantity;
}
