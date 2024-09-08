package salih_korkmaz.dnm_1005.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "E-posta alanı boş olamaz.")
    @Email(message = "Geçerli bir e-posta adresi giriniz.")
    private String email;

    @NotBlank(message = "Şifre alanı boş olamaz.")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır.")
    private String password;
}
