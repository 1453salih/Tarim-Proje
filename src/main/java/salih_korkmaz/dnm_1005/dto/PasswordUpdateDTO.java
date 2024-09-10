package salih_korkmaz.dnm_1005.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PasswordUpdateDTO {
    @NotNull
    private String oldPassword;  // Eski şifreyi doğrulamak için
    @NotNull
    private String newPassword;  // Yeni şifre
}
