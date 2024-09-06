package salih_korkmaz.dnm_1005.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String userId; // userId geri eklendi
}
