package salih_korkmaz.dnm_1005.dto;
import lombok.Data;

@Data
public class EvaluationDTO {
    private Long id;
    private Long harvestId;
    private String weatherCondition;
    private String irrigation;
    private String fertilisation;
    private String spraying;
    private String productQuality;
    private double productQuantity;
}
