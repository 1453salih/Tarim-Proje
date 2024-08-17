package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

@Data
public class DistrictDTO {
    private long code;
    private String name;
    private String slug;
    private String type;
    private String latitude;
    private String longitude;
    private int cityCode;  // Şehir kodunu da DTO'da saklayabiliriz
}
