package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

@Data
public class LandDTO {
    private Long id;
    private String name;
    private int landSize;
    private String city;
    private String district;
    private String village;
    private Long userId; // User ID Değeri
}
