package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "cities")
public class City {

    @Id
    private int code;

    private String name;
    private String slug;
    private String type;
    private String latitude;
    private String longitude;

    @OneToMany(mappedBy = "city" ,cascade = CascadeType.ALL)
    @JsonManagedReference // Bu taraf serileştirilecek
    private List<District> districts;
}
