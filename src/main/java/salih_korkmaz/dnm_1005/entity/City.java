package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.List;


@Data
@Entity
@Table(name = "citys")
public class City {

    @Id
    private int code;

    private String name;
    private String slug;
    private String type;
    private String latitude;
    private String longitude;

    @OneToMany(mappedBy = "city")
    @JsonManagedReference // Bu taraf serileştirilecek
    private List<District> districts;
}
