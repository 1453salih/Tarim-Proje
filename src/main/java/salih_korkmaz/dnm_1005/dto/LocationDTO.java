package salih_korkmaz.dnm_1005.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LocationDTO {
    private String cityName;
    private String districtName;
    private String localityName;
    private long cityCode;
    private long districtCode;
    private long localityCode;
}