package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

@Data
public class LocalityDTO {
    private long code;
    private String name;
    private String slug;
    private String type;
    private long districtCode;
}
