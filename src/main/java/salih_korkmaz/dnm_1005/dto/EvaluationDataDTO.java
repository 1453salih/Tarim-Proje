package salih_korkmaz.dnm_1005.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class EvaluationDataDTO {
    private Long id;
    private String plantName;
    private String plantImageUrl;
    private double productQuantity;
    private long harvestId;
}
