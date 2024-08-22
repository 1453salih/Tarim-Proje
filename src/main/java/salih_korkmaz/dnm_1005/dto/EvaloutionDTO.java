package salih_korkmaz.dnm_1005.dto;
import lombok.Data;

@Data
public class EvaloutionDTO {
    private Long id;
    private Long harvestId;
    private String harvestCondition;
    private String productQuality;
    private double productQuantity;
    private double overallRating;
}
