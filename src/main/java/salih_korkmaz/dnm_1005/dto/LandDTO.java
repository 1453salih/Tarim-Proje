package salih_korkmaz.dnm_1005.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

@Data
public class LandDTO {
    private Long id;

    @NotNull(message = "Name cannot be null")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    private String imageUrl;

    @NotNull(message = "Land size cannot be null")
    private int landSize;

    @NotNull(message = "Locality ID cannot be null")
    private Long localityId; // Mahalle ID'sini tutar

    @NotNull(message = "User ID cannot be null")
    private Long userId; // User ID Değeri

    private LocationDTO location; // Locality, District ve City bilgilerini tutar
}
