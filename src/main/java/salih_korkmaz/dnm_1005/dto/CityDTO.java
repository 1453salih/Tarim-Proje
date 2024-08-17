package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

@Data
public class CityDTO {
    private int code;
    private String name;
    private String slug;
    private String type;
    private String latitude;
    private String longitude;
}
